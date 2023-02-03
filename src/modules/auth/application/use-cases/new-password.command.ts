import { NewPasswordDto } from '../../api/input-dtos/new-password.dto';

export class NewPasswordCommand {
  constructor(public readonly newPasswordInputModel: NewPasswordDto) {}
}
