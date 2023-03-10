import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscriptionToBlogCommand } from '../subscription-to-blog.command';
import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../infrastructure/blogs.repositories';
import { UsersRepositories } from '../../../../sa-users/infrastructure/users-repositories';

@CommandHandler(SubscriptionToBlogCommand)
export class SubscriptionToBlogHandler implements ICommandHandler<SubscriptionToBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepositories, private readonly userRepo: UsersRepositories) {}

  async execute(command: SubscriptionToBlogCommand) {
    const { blogId, userId } = command;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    blog.addSubscription();
    await this.blogsRepo.saveBlog(blog);
    const user = await this.userRepo.findUserById(userId);
    user.setSubscription(blogId, userId, user);
    await this.userRepo.saveUser(user);
    return;
  }
}
