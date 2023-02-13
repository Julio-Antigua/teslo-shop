import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import { LoginUserDto,CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    
    try{

      const {password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save(user);
      delete user.password;

      // TODO: Retornar el JWT
      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };


    }catch(error){
      this.handleDBErrors(error)
    }

  }

  async loginUser(loginUserDto: LoginUserDto){
     const {password, email} = loginUserDto;

     const user = await this.userRepository.findOne({
     where:{ email },
     select: { email: true, password: true, id: true }
    });

    if(!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)')

      //TODO: regresar token
     return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never{
    if(error.code === '23505')
      throw new BadRequestException( error.detail);
    
    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }


}
