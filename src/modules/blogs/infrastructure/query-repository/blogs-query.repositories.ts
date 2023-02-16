import { Injectable } from '@nestjs/common';
import { BanInfoForBlogType, BlogOwnerInfoType, BlogViewForSaModel } from './blog-view-for-sa.dto';
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
import { ImageBlog } from '../../../../entities/imageBlog.entity';
import { BlogImagesViewModel, PhotoSizeModel } from '../../../blogger/infrastructure/blog-images-view.dto';

@Injectable()
export class BlogsQueryRepositories {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BannedBlogUser)
    private readonly bannedBlogUserRepo: Repository<BannedBlogUser>,
    @InjectRepository(ImageBlog)
    private readonly imageBlogRepo: Repository<ImageBlog>,
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
      object.isMembership,
      blogOwnerInfo,
      banInfoForBlog,
    );
  }

  private mapperBlog(blog: Blog): BlogViewModel {
    let images: BlogImagesViewModel;
    if (blog.image === null) {
      images = new BlogImagesViewModel(null, null);
      return new BlogViewModel(blog.id, blog.name, blog.description, blog.websiteUrl, blog.createdAt, blog.isMembership, images);
    }
    const imageWallpaperDefault = new PhotoSizeModel(blog.image.keyImageWallpaper, 1028, 312, blog.image.sizeImageWallpaper);
    const imageWallpaper = blog.image.keyImageWallpaper ? imageWallpaperDefault : null;
    const imageMainDefault = new PhotoSizeModel(blog.image.keyImageMain, 156, 156, blog.image.sizeMainImage);
    const imageSmallMainDefault = new PhotoSizeModel(blog.image.keySmallImageMain, 48, 48, blog.image.sizeSmallImageMain);
    const imageMain = blog.image.keyImageMain ? [imageMainDefault, imageSmallMainDefault] : null;
    images = new BlogImagesViewModel(imageWallpaper, imageMain);
    return new BlogViewModel(blog.id, blog.name, blog.description, blog.websiteUrl, blog.createdAt, blog.isMembership, images);
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
        select: ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'isMembership', 'image'],
        relations: { image: true },
        where: filter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.blogRepo.count({ where: filter }),
    ]);
    const mappedBlogs = blogs.map((blog) => this.mapperBlog(blog));
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, mappedBlogs);
  }

  async findBlogsForSa(data: PaginationBlogDto): Promise<PaginationViewDto<BlogViewForSaModel>> {
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
        select: ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'isMembership', 'image'],
        relations: { image: true },
        where: filter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.blogRepo.count({ where: filter }),
    ]);
    const mappedBlogs = blogs.map((blog) => this.mapperBlog(blog));
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found Blogs with pagination!
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, mappedBlogs);
  }

  async findBlog(id: string): Promise<BlogViewModel> {
    const blog = await this.blogRepo.findOne({
      select: [],
      relations: { image: true },
      where: { id: id, isBanned: false },
    });
    if (!blog) throw new NotFoundExceptionMY(`Not found current blog with id: ${id}`);
    return this.mapperBlog(blog);
  }

  async findBlogWithMapped(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findOneBy({
      id: id,
      isBanned: false,
    });
    if (!blog) return null;
    return blog;
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

  async getImageMain(id: string): Promise<BlogImagesViewModel> {
    const imageBlogInfo = await this.imageBlogRepo.findOne({
      where: { blogId: id },
    });
    let photoInfoWallpaper = null;
    if (imageBlogInfo.keyImageWallpaper !== null) {
      photoInfoWallpaper = new PhotoSizeModel(imageBlogInfo.keyImageWallpaper, 1028, 312, imageBlogInfo.sizeImageWallpaper);
    }

    const photoInfoMain = new PhotoSizeModel(imageBlogInfo.keyImageMain, 156, 156, imageBlogInfo.sizeMainImage);
    const photoInfoReducedMain = new PhotoSizeModel(imageBlogInfo.keySmallImageMain, 48, 48, imageBlogInfo.sizeSmallImageMain);
    return new BlogImagesViewModel(photoInfoWallpaper, [photoInfoMain, photoInfoReducedMain]);
  }

  async getImageWallpaper(blogId: string): Promise<BlogImagesViewModel> {
    const imageBlogInfo = await this.imageBlogRepo.findOne({
      where: { blogId: blogId },
    });
    let photoInfoMain = null;
    if (imageBlogInfo.keyImageMain !== null) {
      const infoMain = new PhotoSizeModel(imageBlogInfo.keyImageMain, 156, 156, imageBlogInfo.sizeMainImage);
      const infoReducedMain = new PhotoSizeModel(imageBlogInfo.keySmallImageMain, 48, 48, imageBlogInfo.sizeSmallImageMain);
      photoInfoMain = [infoMain, infoReducedMain];
    }
    const photoInfoWallpaper = new PhotoSizeModel(imageBlogInfo.keyImageWallpaper, 1028, 312, imageBlogInfo.sizeImageWallpaper);
    return new BlogImagesViewModel(photoInfoWallpaper, photoInfoMain);
  }
}
