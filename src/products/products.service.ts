import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID } from 'uuid'
import { Product,ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(

    @InjectRepository(Product)
    private readonly  productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly ProductImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ){}

  // TODO: paginar
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
      relations: {
        images: true,
      }
    });
    return products.map( (product) => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
    // Forma con destructuracion de argumentos
    // return products.map( ({ images, ...rest}) => ({
    //   ...rest,
    //   images:images.map(img => img.url)
    // }))
  }

  async findOne(term: string) {
    let product: Product;
    
    if( isUUID(term)){
      product = await this.productRepository.findOneBy({id:term});
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
      .where(`UPPER(title) =:title or slug =:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }

    if( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  async findOnePlain( term: string){
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async create(createProductDto: CreateProductDto) {
    
    try{
      const { images = [], ...productDetails /* operador rest*/ } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails /*operador spread*/,
        images: images.map( image => this.ProductImageRepository.create({url: image}) )
      });
      await this.productRepository.save(product);

      return {...product, images};

    }catch(error){
      this.handlerDBExceptions(error);
    }

  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const {images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload({ id,...toUpdate });

    if( !product) throw new NotFoundException(`Product with id: ${id} not found`);

    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    

    try
    {
      await this.productRepository.save(product);
      return product;
    }catch(error)
    {
      this.handlerDBExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await  this.productRepository.remove(product);
  }

  private handlerDBExceptions(error: any){
      if(error.code === '23505')
        throw new BadRequestException(error.detail);

      this.logger.error(error)
      throw new InternalServerErrorException(`Unexpected error, check server logs`);
  }
}
