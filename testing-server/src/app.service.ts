import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from './models/user/user.interface';
import * as mockdata from 'mockdata';

@Injectable()
export class AppService {
  login(dto: LoginDto): string {
    if (dto.username === 'admin' && dto.password === 'admin') {
      return '1234567890';
    }

    throw new HttpException(
      'Username o password non corretti',
      HttpStatus.FORBIDDEN,
    );
  }

  getUsers(): User[] {
    console.log(mockdata);
    return Array(10)
      .fill(0)
      .map(() => ({
        firstName: mockdata.name(),
        lastName: mockdata.title(),
        email: (
          mockdata.name() +
          '.' +
          mockdata.word() +
          '@' +
          mockdata.site() +
          '.com'
        ).toLowerCase(),
        avatar:
          'https://via.placeholder.com/150/' +
          mockdata.color().replace('#', ''),
      }));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
