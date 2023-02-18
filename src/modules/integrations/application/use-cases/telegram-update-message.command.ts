import { TelegramUpdateMessage } from '../../types/telegram-update-message-type';

export class TelegramUpdateMessageCommand {
  constructor(public readonly payload: TelegramUpdateMessage) {}
}
