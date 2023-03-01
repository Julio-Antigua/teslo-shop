import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators';
import { IncomingHttpHeaders } from 'http';

import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({status: 201, description: 'User was registed', type: CreateUserDto})
  @ApiResponse({status: 400, description: 'Bad Reques'})
  @ApiResponse({status: 403, description: 'Forbidden. Token related.'})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @ApiResponse({status: 201, description: 'User was login', type: LoginUserDto})
  @ApiResponse({status: 400, description: 'Bad Reques'})
  @ApiResponse({status: 403, description: 'Forbidden. Token related.'})
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthstatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
  @Req() request: Express.Request,
  @GetUser() user: User,
  @GetUser('email') userEmail: string,
  @RawHeaders() rawHeaders: string[],
  @Headers() headers: IncomingHttpHeaders
  ){
    console.log(request)

    return{
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
    }

  }

  @Get('private2')
  // @SetMetadata('roles', ['admin','super-user'])
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  privateRoute3(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }


}
