import { EmailRecoveryDto } from '../../api/input-dtos/email-recovery.dto';

export class ResendingCommand {
  constructor(public readonly resendingInputModel: EmailRecoveryDto) {}
}
