import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Product } from './';
import { Auditory } from 'src/common/interfaces/auditory.interface';
import { ApiProperty } from '@nestjs/swagger';


@Entity({name: 'product_images'})
export class ProductImage implements Auditory{

    @ApiProperty({
        example: 'ab355bd1-39cd-4208-b073-cac883ddd6f0',
        description: 'Product-Image ID',
        uniqueItems: true
     })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'https://teslo_nestjs.jpg',
        description: 'Product-Image Url',
     })
    @Column({
        type: 'text'
    })
    url: string;

    @ApiProperty({
        example: 'ab244bd3-39ab-4207-b626-cac778fff7f0',
        description: 'Product ID',
     })
    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' }
    )
    productId: Product;

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
    public AuditoryInsert(){
        this.creationDate = new Date();
        this.modificationDate = new Date();
    }

    @BeforeUpdate()
    AuditoryDateUpdate(){
        this.modificationDate = new Date();
    }
}