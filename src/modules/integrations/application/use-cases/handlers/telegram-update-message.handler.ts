import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TelegramUpdateMessageCommand } from '../telegram-update-message.command';

@CommandHandler(TelegramUpdateMessageCommand)
export class TelegramUpdateMessageHandler implements ICommandHandler<TelegramUpdateMessageCommand> {
  constructor() {}

  async execute(command: TelegramUpdateMessageCommand) {
    const {} = command;

    return;
  }
}
