import { Injectable } from '@nestjs/common';
import { BanInfoType, UsersViewType } from './user-View-Model';
import { PaginationUsersDto } from '../../api/input-Dto/pagination-Users-Dto-Model';
import { PaginationViewModel } from '../../../blogs/infrastructure/query-repository/pagination-View-Model';
import { MeViewModel } from '../../../auth/infrastructure/me-View-Model';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entities/user.entity';

@Injectable()
export class UsersQueryRepositories {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private mappedForUser(user: User): UsersViewType {
    const banInfo = new BanInfoType(user.isBanned, user.banDate, user.banReason);
    return new UsersViewType(
      user.userId,
      user.login,
      user.email,
      user.createdAt.toISOString(),
      banInfo,
    );
  }

  async findUser(id: string): Promise<UsersViewType> {
    const user = await this.userRepo.findOneBy({ userId: id });
    if (!user) return null;
    return this.mappedForUser(user);
  }

  async findUsers(data: PaginationUsersDto): Promise<PaginationViewModel<UsersViewType[]>> {
    const {
      searchEmailTerm,
      searchLoginTerm,
      pageNumber,
      pageSize,
      sortBy,
      banStatus,
      sortDirection,
    } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    let filter = {};
    if (banStatus === 'banned') {
      filter = { isBanned: true };
    }
    if (banStatus === 'notBanned') {
      filter = { isBanned: false };
    }
    if (searchEmailTerm.trim().length > 0 || searchLoginTerm.trim().length > 0) {
      filter = [{ email: ILike(`%${searchEmailTerm}%`) }, { login: ILike(`%${searchLoginTerm}%`) }];
    }
    const [users, count] = await Promise.all([
      this.userRepo.find({
        select: ['userId', 'login', 'email', 'createdAt', 'isBanned', 'banDate', 'banReason'],
        where: filter,
        order: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      this.userRepo.count({ where: filter }),
    ]);
    //mapped user for View
    const mappedUsers = users.map((user) => this.mappedForUser(user));
    const items = await Promise.all(mappedUsers);
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Users with pagination!
    return new PaginationViewModel(pagesCountRes, pageNumber, pageSize, count, items);
  }

  async getUserById(id: string): Promise<MeViewModel> {
    const { email, login, userId } = await this.userRepo.findOneBy({
      userId: id,
    });
    return { email, login, userId };
  }
}
