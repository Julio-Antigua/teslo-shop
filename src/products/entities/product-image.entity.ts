import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './';


@Entity()
export class ProductImage{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text'
    })
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images
    )
    product: Product;
}