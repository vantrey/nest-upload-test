import { Injectable } from '@nestjs/common';
import { BanInfoForBlogType, BlogOwnerInfoType, BlogViewForSaModel } from './blog-View-Model';
import { PaginationViewDto } from '../../../../common/pagination-View.dto';
import { PaginationBlogDto } from '../../api/input-Dtos/pagination-blog.dto';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';
import { UsersForBanBlogView } from '../../../sa-users/infrastructure/query-reposirory/user-ban-for-blog-view.dto';
import { Blog } from '../../../../entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BannedBlogUser } from '../../../../entities/banned-blog-user.entity';
import { PaginationUsersByLoginDto } from '../../api/input-Dtos/pagination-users-by-login.dto';
import { BlogViewModel } from './blog-view.dto';
import { BanInfoType } from '../../../sa-users/infrastructure/query-reposirory/ban-info.dto';

@Injectable()
export class BlogsQueryRepositories {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BannedBlogUser)
    private readonly bannedBlogUserRepo: Repository<BannedBlogUser>,
  ) {}

  private mapperBlogForSaView(object: Blog): BlogViewForSaModel {
    const blogOwnerInfo = new BlogOwnerInfoType(object.userId, object.user.login);
    const banInfoForBlog = new BanInfoForBlogType(object.isBanned, object.banDate);
    return new BlogViewForSaModel(
      object.id,
      object.name,
      object.description,
      object.websiteUrl,
      object.createdAt,
      blogOwnerInfo,
      banInfoForBlog,
    );
  }

  private mapperBanInfo(object: BannedBlogUser): UsersForBanBlogView {
    const banInfo = new BanInfoType(object.isBanned, object.banDate, object.banReason);
    return new UsersForBanBlogView(object.userId, object.login, banInfo);
  }

  async findBlogs(data: PaginationBlogDto): Promise<PaginationViewDto<BlogViewModel>> {
    const { searchNameTerm, pageSize, pageNumber, sortDirection, sortBy } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    let filter: any = { isBanned: false };
    if (searchNameTerm.trim().length > 0) {
      filter = { isBanned: false, name: ILike(`%${searchNameTerm}%`) };
    }
    //search all blogs for current user
    const [blogs, count] = await Promise.all([
      this.blogRepo.find({
        select: ['id', 'name', 'description', 'websiteUrl', 'createdAt'],
        where: filter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.blogRepo.count({ where: filter }),
    ]);
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, blogs);
  }

  async findBlogsForSa(data: PaginationBlogDto): Promise<PaginationViewDto<BlogViewModel>> {
    const { searchNameTerm, pageSize, pageNumber, sortDirection, sortBy } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    let filter = {};
    if (searchNameTerm.trim().length > 0) {
      filter = { name: ILike(`%${searchNameTerm}%`) };
    }
    //search all blogs for current user and counting
    const [blogs, count] = await Promise.all([
      this.blogRepo.find({
        select: ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'userId', 'isBanned', 'banDate'],
        relations: { user: true },
        where: filter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.blogRepo.count({ where: filter }),
    ]);
    //mapped for View
    const mappedBlogs = blogs.map((blog) => this.mapperBlogForSaView(blog));
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, mappedBlogs);
  }

  async findBlogsForCurrentBlogger(data: PaginationBlogDto, userId: string): Promise<PaginationViewDto<BlogViewModel>> {
    const { searchNameTerm, pageSize, pageNumber, sortDirection, sortBy } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    let filter: any = { userId: userId, isBanned: false };
    if (searchNameTerm.trim().length > 0) {
      filter = {
        userId: userId,
        isBanned: false,
        name: ILike(`%${searchNameTerm}%`),
      };
    }
    //search all blogs and counting for current user
    const [blogs, count] = await Promise.all([
      this.blogRepo.find({
        select: ['id', 'name', 'description', 'websiteUrl', 'createdAt'],
        where: filter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.blogRepo.count({ where: filter }),
    ]);
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, blogs);
  }

  async findBlog(id: string): Promise<BlogViewModel> {
    const blog = await this.blogRepo.findOneBy({ id: id, isBanned: false });
    if (!blog) throw new NotFoundExceptionMY(`Not found current blog with id: ${id}`);
    // return new BlogViewModel(blog.id, blog.name, blog.description, blog.websiteUrl, blog.createdAt);
    return new BlogViewModel(blog.id, blog.name, blog.description, blog.websiteUrl, blog.createdAt);
    // blogView.id;
    // blogView.name;
    // blogView.description;
    // blogView.websiteUrl;
    // blogView.createdAt;
    // return blogView;
  }

  async findBlogWithMap(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findOneBy({ id: id, isBanned: false });
    if (!blog) throw new NotFoundExceptionMY(`Not found current blog with id: ${id}`);
    return blog;
  }

  async getBannedUsersForBlog(
    blogId: string,
    paginationInputModel: PaginationUsersByLoginDto,
  ): Promise<PaginationViewDto<UsersForBanBlogView>> {
    const { searchLoginTerm, pageSize, pageNumber, sortDirection, sortBy } = paginationInputModel;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    let filter: any = { blogId: blogId, isBanned: true };
    if (searchLoginTerm.trim().length > 0) {
      filter = {
        blogId: blogId,
        isBanned: true,
        login: ILike(`%${searchLoginTerm}%`),
      };
    }
    //search all blogs for current user
    const [blogs, count] = await Promise.all([
      this.bannedBlogUserRepo.find({
        select: ['isBanned', 'banReason', 'banDate', 'userId', 'login'],
        where: filter,
        order: { [sortBy]: order },
        skip: paginationInputModel.skip,
        take: pageSize,
      }),
      this.bannedBlogUserRepo.count({ where: filter }),
    ]);
    //mapped for View
    const mappedBlogs = blogs.map((blog) => this.mapperBanInfo(blog));
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, mappedBlogs);
  }
}
