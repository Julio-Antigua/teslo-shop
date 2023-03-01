import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities/user.entity";
import { Auditory } from "src/common/interfaces/auditory.interface";

@Entity({name: 'products'})
export class Product implements Auditory {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column('float',{
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    // tags
    @Column({
        type: 'text',
        array: true,
        default: []
    })
    tags: string[];

    // images
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

    @Column({
        type: 'text',
        default: ''
    })
    creationUser: string;

    @Column({
        type: 'timestamp',
        default: new Date()
    })
    creationDate: Date;

    @Column({
        type: 'text',
        default: ''
    })
    modificationUser: string;
    
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
