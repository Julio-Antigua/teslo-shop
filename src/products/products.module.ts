import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]), //aqui declaramos las entidades con las que vamos a trabajar
    AuthModule
  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule {}
