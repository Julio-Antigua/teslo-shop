import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities/user.entity";
import { Auditory } from "src/common/interfaces/auditory.interface";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product implements Auditory {

    @ApiProperty({
       example: 'ab244bd3-39ab-4207-b626-cac778fff7f0',
       description: 'Product ID',
       uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
     })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price'
     })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'T-shirt de la nueva collection de ropa de Teslo',
        description: 'Product Description',
        default: null
     })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
     })
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: '10',
        description: 'Product stock',
        default: 0
     })
    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','L','XXL'],
        description: 'Product size'
     })
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender'
     })
    @Column('text')
    gender: string;

    // tags
    @ApiProperty()
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];

    // images
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) =>  productImage.productId,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        ( user ) => user.product,
        {eager: true}
    )
    user: User;

    @ApiProperty()
    @Column({
        type: 'text',
        default: ''
    })
    creationUser: string;

    @ApiProperty()
    @Column({
        type: 'timestamp',
        default: new Date()
    })
    creationDate: Date;

    @ApiProperty()
    @Column({
        type: 'text',
        default: ''
    })
    modificationUser: string;

    @ApiProperty()
    @Column({
        type: 'timestamp',
        default: new Date()
    })
    modificationDate: Date;

    @BeforeInsert()
    AuditoryInsert(){
        this.creationDate = new Date();
        this.creationUser = this.user.email;
        this.modificationDate = new Date();
        this.modificationUser = this.user.email;
    }

    @BeforeUpdate()
    AuditoryDateUpdate(){
        this.modificationUser = this.user.email;
        this.modificationDate = new Date();
    }

    @BeforeInsert()
    checkSlugInsert(){
        if(! this.slug ){
            this.slug = this.title
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


}
