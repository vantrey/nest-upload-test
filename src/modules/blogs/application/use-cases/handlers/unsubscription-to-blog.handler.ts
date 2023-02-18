import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../infrastructure/blogs.repositories';
import { UnsubscriptionToBlogCommand } from '../unsubscription-to-blog.command';
import { UsersRepositories } from '../../../../sa-users/infrastructure/users-repositories';

@CommandHandler(UnsubscriptionToBlogCommand)
export class UnsubscriptionToBlogHandler implements ICommandHandler<UnsubscriptionToBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepositories, private readonly userRepo: UsersRepositories) {}

  async execute(command: UnsubscriptionToBlogCommand) {
    const { blogId, userId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    blog.unSubscribe();
    await this.blogsRepo.saveBlog(blog);
    //user ----->
    const user = await this.userRepo.findUserById(userId);
    user.unSubscribe(blogId);
    await this.userRepo.saveUser(user);
    return;
  }
}
