import { CreateUserDto } from '../../../sa-users/api/input-Dto/create-User.dto';

export class CreateUserCommand {
  constructor(public readonly userInputModel: CreateUserDto) {}
}
