import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadImageBlogCommand } from '../upload-image-blog.command';
import { BloggersService } from '../../../domain/bloggers.service';
import { ForbiddenExceptionMY, NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../../blogs/infrastructure/blogs.repositories';

@CommandHandler(UploadImageBlogCommand)
export class UploadImageBlogHandler implements ICommandHandler<UploadImageBlogCommand> {
  constructor(private readonly bloggersService: BloggersService, private readonly blogsRepo: BlogsRepositories) {}

  async execute(command: UploadImageBlogCommand) {
    const { userId, blogId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId)) throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    // await this.bloggersService.filesStorage(command);
    //imageId , URL
    //saved blog
    //
    return '';
  }
}
