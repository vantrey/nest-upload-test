import { UsersRepositories } from '../../../infrastructure/users-repositories';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBanInfoCommand } from '../updateBanInfoCommand';
import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { PostsRepositories } from '../../../../posts/infrastructure/posts-repositories';

@CommandHandler(UpdateBanInfoCommand)
export class UpdateBanInfoHandler implements ICommandHandler<UpdateBanInfoCommand> {
  constructor(
    private readonly usersRepo: UsersRepositories,
    private readonly postsRepo: PostsRepositories,
  ) {}

  async execute(command: UpdateBanInfoCommand): Promise<boolean> {
    const { userId } = command;
    const { isBanned, banReason } = command.updateBanInfoModel;
    const user = await this.usersRepo.findUserByIdWithMapped(userId);
    //userForBan.update()
    //repo.saveBanned(userForBan)
    if (!user) throw new NotFoundExceptionMY(`Not found `);
    isBanned ? user.banUser(banReason) : user.unblockUser();
    // user.checkStatusBan() ? user.banUser(banReason) : user.unblockUser();
    await this.usersRepo.saveUser(user);
    //update status ban -  Posts, LikesPost, Comment, LikesComment for User
    const res = await this.postsRepo.updateStatusBanContentsUser(userId, isBanned);
    if (!res) throw new Error(`Not saved`);
    return true;
  }
}
