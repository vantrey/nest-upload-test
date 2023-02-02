import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor() {}

  public generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }
}

