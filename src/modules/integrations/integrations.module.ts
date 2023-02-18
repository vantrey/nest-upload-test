import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { TelegramAdapter } from './adapters/telegram.adapter';
import { TelegramUpdateMessageHandler } from './application/use-cases/handlers/telegram-update-message.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { IntegrationsService } from './integrations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getConfiguration } from '../../config/configuration';
import { SubscriptionToBlog } from '../../entities/subscription.entity';
import { BlogsRepositories } from '../blogs/infrastructure/blogs.repositories';
import { Blog } from '../../entities/blog.entity';
import { BannedBlogUser } from '../../entities/banned-blog-user.entity';
import { ImageBlog } from '../../entities/imageBlog.entity';

const adapters = [TelegramAdapter, BlogsRepositories];
const handlers = [
  //---> integrations
  TelegramUpdateMessageHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionToBlog, Blog, BannedBlogUser, ImageBlog]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
    }),
    CqrsModule,
  ],
  controllers: [IntegrationsController],
  providers: [...adapters, ...handlers, IntegrationsService],
})
export class IntegrationsModule {}
