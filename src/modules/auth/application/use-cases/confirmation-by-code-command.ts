import { ConfirmationCodeDto } from '../../api/input-dtos/confirmation-code.dto';

export class ConfirmByCodeCommand {
  constructor(public readonly codeInputModel: ConfirmationCodeDto) {}
}
