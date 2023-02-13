import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { Server } from 'http';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // es parta que cargue las entidades que vamos definiendo poco a poco
      synchronize: true  // funcionas para cuando creamos un cambio en las entidades automatica mente las sincronizas con los cambios nuevos a la base de datos
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public' )
    }),

    ProductsModule,

    CommonModule,

    SeedModule,

    FilesModule,

    AuthModule
  ],
})
export class AppModule {}
