import { Injectable } from '@nestjs/common';
import { PaginationUsersDto } from '../../api/input-Dto/pagination-Users.dto';
import { PaginationViewDto } from '../../../../common/pagination-View.dto';
import { MeViewDto } from '../../../auth/infrastructure/me-view.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../entities/user.entity';
import { UserViewModel } from './user-view.dto';
import { BanInfoType } from './ban-info.dto';

@Injectable()
export class UsersQueryRepositories {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private mappedForUser(user: User): UserViewModel {
    const banInfo = new BanInfoType(user.isBanned, user.banDate, user.banReason);
    return new UserViewModel(user.id, user.login, user.email, user.createdAt.toISOString(), banInfo);
  }

  async findUser(id: string): Promise<UserViewModel> {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) return null;
    return this.mappedForUser(user);
  }

  async findUsers(data: PaginationUsersDto): Promise<PaginationViewDto<UserViewModel>> {
    const { searchEmailTerm, searchLoginTerm } = data;
    let filter: any = {};
    if (searchEmailTerm && searchLoginTerm) {
      filter.where = [{ login: ILike(`%${searchLoginTerm}%`) }, { email: ILike(`%${searchEmailTerm}%`) }];
    } else if (searchEmailTerm) {
      filter.where = { email: ILike(`%${searchEmailTerm}%`) };
    } else if (searchLoginTerm) {
      filter.where = { login: ILike(`%${searchLoginTerm}%`) };
    }
    if (data.getBanStatus() === 'banned') {
      if (filter.where?.length) {
        filter.where = filter.where.map((e) => ({ ...e, isBanned: true }));
      } else {
        filter.where = { ...filter.where, isBanned: true };
      }
    }
    if (data.getBanStatus() === 'notBanned') {
      if (filter.where?.length) {
        filter.where = filter.where.map((e) => ({ ...e, isBanned: false }));
      } else {
        filter.where = { ...filter.where, isBanned: false };
      }
    }
    const [users, count] = await this.userRepo.findAndCount({
      select: ['id', 'login', 'email', 'createdAt', 'isBanned', 'banDate', 'banReason'],
      where: filter.where,
      order: { [data.isSorByDefault()]: data.isSortDirection() },
      skip: data.skip,
      take: data.getPageSize(),
    });
    //mapped user for View
    const mappedUsers = users.map((user) => this.mappedForUser(user));
    const items = await Promise.all(mappedUsers);
    const pagesCountRes = Math.ceil(count / data.getPageSize());
    // Found Users with pagination!
    return new PaginationViewDto(pagesCountRes, data.getPageNumber(), data.getPageSize(), count, items);
  }

  async getUserById(userId: string): Promise<MeViewDto> {
    // const user = await this.userRepo.findOneBy({
    const { email, login, id } = await this.userRepo.findOneBy({
      id: userId,
    });
    return new MeViewDto(email, login, id);
    // return { email, login, userId };
  }
}
