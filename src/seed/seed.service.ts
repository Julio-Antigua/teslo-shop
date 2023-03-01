import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {

  constructor( 
    private readonly productsService: ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async runSeed() {
    await this.deleteTables();
    const amdinUser = await this.insertUsers();
    await this.insertNewProducts(amdinUser);
    return 'SEED EXECUTED';
  }

  private async deleteTables(){
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute()
  }

  private async insertUsers(){
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push( this.userRepository.create(user) )
    });

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User){
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push( this.productsService.create(product, user) );
    });

    await Promise.all(insertPromises); // espera a que todas las promesas se resuelvan y cuando todas las promesas se resuelvan, sigue con la siguiente linea

    return true;
  }

}
