import { Auditory } from 'src/common/interfaces/auditory.interface';
import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User implements Auditory {
    

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @Column({
        type: 'text'
    })
    fullName: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;

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
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }
    
    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
    
    @BeforeInsert()
    AuditoryInsert(){
        this.creationDate = new Date();
        this.creationUser = this.fullName;
        this.modificationDate = new Date();
        this.modificationUser = this.email;
    }

    @BeforeUpdate()
    AuditoryDateUpdate(){
        this.modificationUser = this.email;
        this.modificationDate = new Date();
    }

}
