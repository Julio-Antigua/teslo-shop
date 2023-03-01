import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Product } from './';
import { Auditory } from 'src/common/interfaces/auditory.interface';


@Entity({name: 'product_images'})
export class ProductImage implements Auditory{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text'
    })
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' }
    )
    productId: Product;

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
    public AuditoryInsert(){
        this.creationDate = new Date();
        this.modificationDate = new Date();
    }

    @BeforeUpdate()
    AuditoryDateUpdate(){
        this.modificationDate = new Date();
    }
}