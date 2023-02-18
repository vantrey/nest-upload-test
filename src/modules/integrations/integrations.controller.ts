import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { TelegramUpdateMessage } from './types/telegram-update-message-type';
import { CommandBus } from '@nestjs/cqrs';
import { TelegramUpdateMessageCommand } from './application/use-cases/telegram-update-message.command';
import { IntegrationsService } from './integrations.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('integrations')
export class IntegrationsController {
  constructor(private commandBus: CommandBus, private readonly integrationsService: IntegrationsService) {}

  @ApiTags('integrations')
  @ApiOperation({
    summary: 'Webhook for TelegramBot Api (see telegram bot official documentation)',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('telegram/webhook')
  async forTelegramHook(@Body() payload: TelegramUpdateMessage) {
    console.log('payload------------', payload);
    await this.commandBus.execute(new TelegramUpdateMessageCommand(payload));
    return { here: 'here' };
  }

  @Get(`notification`)
  sendMessage(@Body() inputModel: any) {
    return this.integrationsService.sendMessage(inputModel);
  }
}
