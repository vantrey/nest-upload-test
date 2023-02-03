import { Injectable } from '@nestjs/common';
import { PostViewModel } from './post-view.dto';
import { ExtendedLikesInfoViewModel } from './likes-Info-view.dto';
import { PaginationViewDto } from '../../../../common/pagination-View.dto';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';
import {
  BloggerCommentsViewModel,
  CommentatorInfoModel,
  PostInfoModel,
} from '../../../comments/infrastructure/query-repository/comments-view.dto';
import { BannedBlogUser } from '../../../../entities/banned-blog-user.entity';
import { Post } from '../../../../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../../../entities/comment.entity';
import { LikePost, LikeStatusType } from '../../../../entities/like-post.entity';
import { LikeComment } from '../../../../entities/like-comment.entity';
import { PaginationDto } from '../../../../common/pagination.dto';
import { CommentViewModel } from '../../../comments/infrastructure/query-repository/comment-view.dto';
import { LikeInfoViewModel } from '../../../comments/infrastructure/query-repository/like-info-view.dto';

@Injectable()
export class PostsQueryRepositories {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(LikeComment) private readonly likeCommentRepo: Repository<LikeComment>,
    @InjectRepository(LikePost) private readonly likePostRepo: Repository<LikePost>,
    @InjectRepository(BannedBlogUser) private readonly bannedBlogUserRepo: Repository<BannedBlogUser>,
  ) {}

  private async postForView(post: Post, userId: string | null): Promise<PostViewModel> {
    //find likes status
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likePostRepo.findOneBy({
        userId: userId,
        parentId: post.id,
        isBanned: false,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const countLike = await this.likePostRepo.count({
      where: { likeStatus: 'Like', parentId: post.id, isBanned: false },
    });
    const countDislike = await this.likePostRepo.count({
      where: { likeStatus: 'Dislike', parentId: post.id, isBanned: false },
    });
    // finding the newest likes
    const likes = await this.likePostRepo.find({
      relations: { user: true },
      where: { likeStatus: 'Like', parentId: post.id, isBanned: false },
      order: { addedAt: 'DESC' },
      take: 3,
    });
    const newestLikes = likes.map((e) => {
      return { addedAt: e.addedAt, userId: e.userId, login: e.user.login };
    });
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(countLike, countDislike, myStatus, newestLikes);
    return new PostViewModel(
      post.id,
      post.title,
      post.shortDescription,
      post.content,
      post.blogId,
      post.blogName,
      post.createdAt,
      extendedLikesInfo,
    );
  }

  async findPosts(data: PaginationDto, userId: string | null, blogId?: string): Promise<PaginationViewDto<PostViewModel>> {
    const { sortDirection, sortBy, pageSize } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    let filter;
    if (blogId) {
      filter = { blogId: blogId, isBanned: false };
    } else {
      filter = { isBanned: false };
    }
    const [posts, count] = await Promise.all([
      this.postRepo.find({
        select: ['id', 'title', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt'],
        where: filter,
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.postRepo.count({ where: filter }),
    ]);
    //mapped posts for view
    const mappedPosts = posts.map((post) => this.postForView(post, userId));
    const itemsPosts = await Promise.all(mappedPosts);
    //counting blogs user
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found posts with pagination
    return new PaginationViewDto(pagesCountRes, data.pageNumber, data.pageSize, count, itemsPosts);
  }

  async findPost(id: string, userId: string | null): Promise<PostViewModel> {
    //find post by id from uri params
    const post = await this.postRepo.findOne({
      select: ['id', 'title', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt'],
      // relations: { blog: true },
      where: { id: id, isBanned: false },
    });
    // const post = await this.postRepo.findOneBy({ postId: id, isBanned: false });
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    //returning post for View
    return this.postForView(post, userId);
  }

  async findCommentsByIdPost(
    postId: string,
    data: PaginationDto,
    userId: string | null,
  ): Promise<PaginationViewDto<CommentViewModel>> {
    const { sortDirection, sortBy, pageSize } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    //find post by postId and userId
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) throw new NotFoundExceptionMY(`No content found for current id: ${postId}`);
    const [comments, count] = await Promise.all([
      this.commentRepo.find({
        relations: { likesComment: true, user: true },
        where: { postId: postId, isBanned: false },
        order: { [sortBy]: order },
        skip: data.skip,
        take: pageSize,
      }),
      this.commentRepo.count({ where: { postId: postId, isBanned: false } }),
    ]);
    //mapped comments for View
    const mappedComments = comments.map((object) => this.commentByIdPostForView(object, userId));
    const itemsComments = await Promise.all(mappedComments);
    const pagesCountRes = Math.ceil(count / data.pageSize);
    //returning comment with pagination
    return new PaginationViewDto(pagesCountRes, data.pageNumber, data.pageSize, count, itemsComments);
  }

  private async commentByIdPostForView(object: Comment, userId: string | null): Promise<CommentViewModel> {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likeCommentRepo.findOneBy({
        userId: userId,
        parentId: object.id,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const [countLike, countDislike] = await Promise.all([
      this.likeCommentRepo.count({
        where: {
          parentId: object.id,
          likeStatus: 'Like',
          isBanned: false,
        },
      }),
      this.likeCommentRepo.count({
        where: {
          parentId: object.id,
          likeStatus: 'Dislike',
          isBanned: false,
        },
      }),
    ]);
    const likesInfo = new LikeInfoViewModel(countLike, countDislike, myStatus);
    return new CommentViewModel(object.id, object.content, object.userId, object.user.login, object.createdAt, likesInfo);
  }

  async mappedPostForView(post: Post): Promise<PostViewModel> {
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(0, 0, LikeStatusType.None, []);
    //returning created post with extended likes info for View
    return new PostViewModel(
      post.id,
      post.title,
      post.shortDescription,
      post.content,
      post.blogId,
      post.blog.name,
      post.createdAt,
      extendedLikesInfo,
    );
  }

  async getCommentsBloggerForPosts(
    userId: string,
    paginationInputModel: PaginationDto,
  ): Promise<PaginationViewDto<BloggerCommentsViewModel>> {
    const { sortDirection, sortBy, pageSize, pageNumber } = paginationInputModel;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    const [comments, count] = await Promise.all([
      this.commentRepo.find({
        select: ['id', 'content', 'createdAt', 'userId'],
        relations: { post: true, user: true, likesComment: true },
        where: { ownerId: userId },
        order: { [sortBy]: order },
        skip: paginationInputModel.skip,
        take: pageSize,
      }),
      this.commentRepo.count({ where: { ownerId: userId } }),
    ]);
    const mappedPosts = comments.map((object) => this.commentBloggerForPostView(object, userId));
    const items = await Promise.all(mappedPosts);
    // pages count
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found posts with pagination
    return new PaginationViewDto(pagesCountRes, pageNumber, pageSize, count, items);
  }

  private async commentBloggerForPostView(object: Comment, userId: string) {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likeCommentRepo.findOneBy({
        userId: userId,
        parentId: object.id,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const [countLike, countDislike] = await Promise.all([
      this.likeCommentRepo.count({
        where: {
          parentId: object.id,
          likeStatus: 'Like',
          isBanned: false,
        },
      }),
      this.likeCommentRepo.count({
        where: {
          parentId: object.id,
          likeStatus: 'Dislike',
          isBanned: false,
        },
      }),
    ]);
    const likesInfo = new LikeInfoViewModel(countLike, countDislike, myStatus);
    const commentatorInfo = new CommentatorInfoModel(object.userId, object.user.login);
    const postInfo = new PostInfoModel(object.post.id, object.post.title, object.post.blogId, object.post.blogName);
    return new BloggerCommentsViewModel(object.id, object.content, object.createdAt, likesInfo, commentatorInfo, postInfo);
  }
}
