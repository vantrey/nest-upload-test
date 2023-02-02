import { CreateUserDto } from '../../api/input-Dto/create-User.dto';

export class CreateUserSaCommand {
  constructor(public readonly userInputModel: CreateUserDto) {}
}
