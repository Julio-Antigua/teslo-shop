import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { Jwtstrategy } from './strategies/jwt.strategy';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Jwtstrategy],
  imports: [

    ConfigModule,

    CommonModule,

    TypeOrmModule.forFeature([ User]),

    PassportModule.register({defaultStrategy: 'jwt'}),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })
  ],
  exports: [TypeOrmModule, Jwtstrategy, PassportModule, JwtModule]
})
export class AuthModule {}
