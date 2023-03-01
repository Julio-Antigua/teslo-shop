import { ApiProperty } from '@nestjs/swagger';
import { Auditory } from 'src/common/interfaces/auditory.interface';
import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User implements Auditory {
    
    @ApiProperty({
        example: 'ab244bd3-39ab-4207-b626-cac778fff7f0',
        description: 'User ID',
        uniqueItems: true
     })
    @PrimaryGeneratedColumn('uuid')
    id: string;

     
    @ApiProperty({
        example: 'test1@google.com',
        description: 'User email',
        uniqueItems: true
     })
    @Column({
        type: 'text',
        unique: true
    })
    email: string;

     
    @ApiProperty({
        example: 'Abc123',
        description: 'User Password',
     })
    @Column({
        type: 'text',
        select: false
    })
    password: string;

     
    @ApiProperty({
        example: 'Test One',
        description: 'User FullName',
        uniqueItems: true
     })
    @Column({
        type: 'text'
    })
    fullName: string;

    @ApiProperty()
    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean;

    @ApiProperty()
    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @ApiProperty()
    @OneToMany(
        () => Product,
        ( product ) => product.user
    )
    product: Product;

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
