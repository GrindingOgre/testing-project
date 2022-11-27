import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { User } from './models/user/user.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  doLogin(@Body() dto: LoginDto): { result: boolean; token: string } {
    return { result: true, token: this.appService.login(dto) };
  }
  @Get('users')
  getUsers(): { result: boolean; users: User[] } {
    return { result: true, users: this.appService.getUsers() };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
