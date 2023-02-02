import { CreateUserDto } from '../../api/input-Dto/create-User.dto';

export class CreateUserCommand {
  constructor(public readonly userInputModel: CreateUserDto) {}
}
