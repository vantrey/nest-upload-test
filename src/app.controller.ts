import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @ApiResponse({ status: 200, description: 'description' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
