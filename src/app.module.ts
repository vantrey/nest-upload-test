import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestingModule } from './modules/testing/testing.module';
import { ConfigType, getConfiguration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './modules/users/api/users.controller';
import { CreateUserHandler } from './modules/users/application/use-cases/handlers/create-user-handler';
import { CreateUserSaHandler } from './modules/users/application/use-cases/handlers/create-user-sa-handler';
import { DeleteUserHandler } from './modules/users/application/use-cases/handlers/delete-user-handler';
import { UpdateBanInfoHandler } from './modules/users/application/use-cases/handlers/update-ban-info-handler';
import { JwtService } from './modules/auth/application/jwt.service';
import { MailService } from './modules/mail/mail.service';
import { UsersRepositories } from './modules/users/infrastructure/users-repositories';
import { PostsRepositories } from './modules/posts/infrastructure/posts-repositories';
import { UsersQueryRepositories } from './modules/users/infrastructure/query-reposirory/users-query.reposit';
import { DeviceRepositories } from './modules/security/infrastructure/device-repositories';
import { CommentsRepositories } from './modules/comments/infrastructure/comments.repositories';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import { UsersService } from './modules/users/domain/users.service';
import { CqrsModule } from '@nestjs/cqrs';
import { Post, PostSchema } from './modules/posts/domain/post-schema-Model';
import { Comment, CommentSchema } from './modules/comments/domain/comments-schema-Model';
import { LikeComment, LikeCommentSchema } from './modules/comments/domain/likeComment-schema-Model';
import { LikePost, LikePostSchema } from './modules/posts/domain/likePost-schema-Model';
import { DeleteDevicesHandler } from './modules/security/application/use-cases/handlers/delete-devices-handler';
import { DeleteDeviceByIdHandler } from './modules/security/application/use-cases/handlers/delete-device-by-id-handler';
import { DevicesController } from './modules/security/api/devices.controller';
import { DeviceQueryRepositories } from './modules/security/infrastructure/query-repository/device-query.repositories';
import { BindBlogHandler } from './modules/sa/application/use-cases/handlers/bind-blog-handler';
import { UpdateBanInfoForBlogHandler } from './modules/sa/application/use-cases/handlers/update-ban-info-for-blog-handler';
import { BlogsQueryRepositories } from './modules/blogs/infrastructure/query-repository/blogs-query.repositories';
import { BlogsRepositories } from './modules/blogs/infrastructure/blogs.repositories';
import { SaController } from './modules/sa/api/sa.controller';
import { SaService } from './modules/sa/domain/sa.service';
import { CreateCommentHandler } from './modules/posts/application/use-cases/handlers/create-comment-handler';
import { UpdateLikeStatusHandler } from './modules/posts/application/use-cases/handlers/update-like-status-handler';
import { PostsQueryRepositories } from './modules/posts/infrastructure/query-repositories/posts-query.reposit';
import { CommentsQueryRepositories } from './modules/comments/infrastructure/query-repository/comments-query.repositories';
import { JwtAuthGuard } from './guards/jwt-auth-bearer.guard';
import { JwtForGetGuard } from './guards/jwt-auth-bearer-for-get.guard';
import { PostsController } from './modules/posts/api/posts.controller';
import { PostsService } from './modules/posts/domain/posts.service';
import { DeleteCommentHandler } from './modules/comments/application/use-cases/handlers/delete-comment-handler';
import { UpdateCommentHandler } from './modules/comments/application/use-cases/handlers/update-comment-handler';
import { UpdateLikeStatusCommentHandler } from './modules/comments/application/use-cases/handlers/update-like-status-comment-handler';
import { CommentsController } from './modules/comments/api/comments.controller';
import { CommentsService } from './modules/comments/domain/comments.service';
import { BlogsController } from './modules/blogs/api/blogs.controller';
import { BlogsService } from './modules/blogs/domain/blogs.service';
import { BasicStrategy } from './strategies/basic.strategy';
import { CreateBlogHandler } from './modules/blogger/application/use-cases/handlers/create-blog-handler';
import { DeleteBlogHandler } from './modules/blogger/application/use-cases/handlers/delete-blog-handler';
import { UpdateBlogHandler } from './modules/blogger/application/use-cases/handlers/update-blog-handler';
import { CreatePostHandler } from './modules/blogger/application/use-cases/handlers/create-post-handler';
import { DeletePostHandler } from './modules/blogger/application/use-cases/handlers/delete-post-handler';
import { UpdatePostHandler } from './modules/blogger/application/use-cases/handlers/update-post-handler';
import { UpdateBanUserForCurrentBlogHandler } from './modules/blogger/application/use-cases/handlers/update-ban-user-for-current-blog-handler';
import { BloggersController } from './modules/blogger/api/bloggers.controller';
import { BlogIdValidator } from './validators/is-mongo-id-validator.service';
import { BloggersService } from './modules/blogger/domain/bloggers.service';
import { LogoutHandler } from './modules/auth/application/use-cases/handlers/logout-handler';
import { ResendingHandler } from './modules/auth/application/use-cases/handlers/resending-handler';
import { ConfirmByCodeHandler } from './modules/auth/application/use-cases/handlers/confirmation-by-code-handler';
import { NewPasswordHandler } from './modules/auth/application/use-cases/handlers/new-password-handler';
import { RecoveryHandler } from './modules/auth/application/use-cases/handlers/recovery-handler';
import { LoginHandler } from './modules/auth/application/use-cases/handlers/login-handler';
import { RefreshHandler } from './modules/auth/application/use-cases/handlers/refresh-handler';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './modules/auth/api/auth.controller';
import { User } from './entities/user.entity';
import { Device } from './entities/device.entity';
import { Blog } from './entities/blog.entity';
import { BannedBlogUser } from './entities/banned-blog-user.entity';

const controllers = [
  AuthController,
  UsersController,
  SaController,
  DevicesController,
  BlogsController,
  BloggersController,
  PostsController,
  CommentsController,
];
const providers = [
  AppService,
  UsersService,
  SaService,
  BlogsService,
  BloggersService,
  PostsService,
  CommentsService,
  BlogIdValidator,
  BasicStrategy,
  ThrottlerGuard,
  // {
  //   provide: APP_GUARD,
  //   useClass: ThrottlerGuard
  // },
];
const guards = [BasicAuthGuard, JwtAuthGuard, JwtForGetGuard];
const adapters = [
  JwtService,
  MailService,
  UsersRepositories,
  UsersQueryRepositories,
  BlogsRepositories,
  BlogsQueryRepositories,
  PostsRepositories,
  PostsQueryRepositories,
  CommentsRepositories,
  CommentsQueryRepositories,
  DeviceRepositories,
  DeviceQueryRepositories,
];
const handlers = [
  CreateUserHandler,
  CreateUserSaHandler,
  CreateBlogHandler,
  CreatePostHandler,
  CreateCommentHandler,
  LogoutHandler,
  ResendingHandler,
  ConfirmByCodeHandler,
  NewPasswordHandler,
  RecoveryHandler,
  LoginHandler,
  RefreshHandler,
  DeleteUserHandler,
  DeleteBlogHandler,
  DeletePostHandler,
  DeleteCommentHandler,
  DeleteDevicesHandler,
  DeleteDeviceByIdHandler,
  BindBlogHandler,
  UpdateBanInfoForBlogHandler,
  UpdateBanInfoHandler,
  UpdateLikeStatusHandler,
  UpdateCommentHandler,
  UpdateLikeStatusCommentHandler,
  UpdateBlogHandler,
  UpdatePostHandler,
  UpdateBanUserForCurrentBlogHandler,
];
const entities = [User, Device, Blog, BannedBlogUser];

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [getConfiguration] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const database = configService.get('database', { infer: true });
        return { uri: database.MONGO_URL };
      },
    }),
    MongooseModule.forFeature([
      // { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: LikePost.name, schema: LikePostSchema },
      { name: LikeComment.name, schema: LikeCommentSchema },
      // { name: BannedBlogUser.name, schema: BlogBanInfoSchema },
    ]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const database = configService.get('database', { infer: true });
        return {
          type: 'postgres',
          entities: [...entities],
          url: database.PGSQL_URL,
          autoLoadEntities: true,
          synchronize: true,
          ssl: true,
        };
      },
    }),
    TypeOrmModule.forFeature([...entities]),
    MailModule,
    CqrsModule,
    TestingModule,
  ],
  controllers: [AppController, ...controllers],
  providers: [...providers, ...guards, ...adapters, ...handlers],
})
export class AppModule {}
