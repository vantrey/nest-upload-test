import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { UpdateBanInfoForBlogCommand } from '../updateBanInfoForBlogCommand';
import { BlogsRepositories } from '../../../../blogs/infrastructure/blogs.repositories';
import { PostsRepositories } from '../../../../posts/infrastructure/posts-repositories';

@CommandHandler(UpdateBanInfoForBlogCommand)
export class UpdateBanInfoForBlogHandler implements ICommandHandler<UpdateBanInfoForBlogCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepositories,
    private readonly postsRepo: PostsRepositories,
  ) {}

  async execute(command: UpdateBanInfoForBlogCommand): Promise<boolean> {
    const { blogId } = command;
    const { isBanned } = command.updateBanInfoForBlogModel;
    //finding blog for check existence
    const foundBlog = await this.blogsRepo.findBlog(blogId);
    if (!foundBlog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    //update status ban for blog
    foundBlog.updateBanStatus(isBanned);
    //save updated status for blog
    await this.blogsRepo.saveBlog(foundBlog);
    await this.postsRepo.updateStatusBanPostForBlogger(blogId, isBanned);
    return true;
  }
}
