import { Injectable } from '@nestjs/common';
import { BanInfoType, UsersViewType } from './user-View-Model';
import { PaginationUsersDto } from '../../api/input-Dto/pagination-Users-Dto';
import { PaginationViewModel } from '../../../../common/pagination-View-Model';
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
    const banInfo = new BanInfoType(
      user.isBanned,
      user.banDate,
      user.banReason,
    );
    return new UsersViewType(
      user.id,
      user.login,
      user.email,
      user.createdAt.toISOString(),
      banInfo,
    );
  }

  async findUser(id: string): Promise<UsersViewType> {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) return null;
    return this.mappedForUser(user);
  }

  async findUsers(
    data: PaginationUsersDto,
  ): Promise<PaginationViewModel<UsersViewType[]>> {
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
    let advancedFilter;
    if (banStatus === 'banned') {
      filter = { isBanned: true };
    }
    if (banStatus === 'notBanned') {
      filter = { isBanned: false };
    }
    if (
      searchEmailTerm.trim().length > 0 ||
      searchLoginTerm.trim().length > 0
    ) {
      advancedFilter = [
        { login: ILike(`%${searchLoginTerm}%`) },
        { email: ILike(`%${searchEmailTerm}%`) },
      ];
    }
    const queryFilter =
      searchEmailTerm || searchLoginTerm ? advancedFilter : filter;
    const [users, count] = await Promise.all([
      this.userRepo.find({
        select: [
          'id',
          'login',
          'email',
          'createdAt',
          'isBanned',
          'banDate',
          'banReason',
        ],
        where: queryFilter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.userRepo.count({ where: queryFilter }),
    ]);
    //mapped user for View
    const mappedUsers = users.map((user) => this.mappedForUser(user));
    const items = await Promise.all(mappedUsers);
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Users with pagination!
    return new PaginationViewModel(
      pagesCountRes,
      pageNumber,
      pageSize,
      count,
      items,
    );
  }

  async getUserById(userId: string): Promise<MeViewModel> {
    // const user = await this.userRepo.findOneBy({
    const { email, login, id } = await this.userRepo.findOneBy({
      id: userId,
    });
    return new MeViewModel(email, login, id);
    // return { email, login, userId };
  }
}
