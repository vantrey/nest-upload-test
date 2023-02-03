import { EmailRecoveryDto } from '../../api/input-dtos/email-recovery.dto';

export class RecoveryCommand {
  constructor(public readonly emailInputModel: EmailRecoveryDto) {}
}
