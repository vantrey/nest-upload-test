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
    const { searchEmailTerm, searchLoginTerm, pageNumber, pageSize, sortBy, banStatus, sortDirection } = data;
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
    if (searchEmailTerm.trim().length > 0 || searchLoginTerm.trim().length > 0) {
      advancedFilter = [{ login: ILike(`%${searchLoginTerm}%`) }, { email: ILike(`%${searchEmailTerm}%`) }];
    }
    const queryFilter = searchEmailTerm || searchLoginTerm ? advancedFilter : filter;
    console.log('queryFilter', queryFilter); //todo
    const [users, count] = await Promise.all([
      this.userRepo.find({
        select: ['id', 'login', 'email', 'createdAt', 'isBanned', 'banDate', 'banReason'],
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
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, items);
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
