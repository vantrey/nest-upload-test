import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../../blogs/api/input-Dtos/pagination-Dto-Model';
import { PostViewModel } from './post-View-Model';
import { ExtendedLikesInfoViewModel } from './likes-Info-View-Model';
import { PaginationViewModel } from '../../../blogs/infrastructure/query-repository/pagination-View-Model';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';
import {
  BloggerCommentsViewType,
  CommentatorInfoModel,
  CommentsViewType,
  LikesInfoViewModel,
  PostInfoModel,
} from '../../../comments/infrastructure/query-repository/comments-View-Model';
import { BannedBlogUser } from '../../../../entities/banned-blog-user.entity';
import { Post } from '../../../../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../../../entities/comment.entity';
import { LikePost, LikeStatusType } from '../../../../entities/like-post.entity';
import { LikeComment } from '../../../../entities/like-comment.entity';

@Injectable()
export class PostsQueryRepositories {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(LikeComment) private readonly likeCommentRepo: Repository<LikeComment>,
    @InjectRepository(LikePost) private readonly likePostRepo: Repository<LikePost>,
    @InjectRepository(BannedBlogUser)
    private readonly bannedBlogUserRepo: Repository<BannedBlogUser>,
  ) {}

  private async postForView(post: any, userId: string | null): Promise<PostViewModel> {
    //find likes status
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likePostRepo.findOneBy({
        userId: userId,
        parentId: post.postId,
        isBanned: false,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const countLike = await this.likePostRepo.count({
      where: { likeStatus: 'Like', parentId: post.postId, isBanned: false },
    });
    const countDislike = await this.likePostRepo.count({
      where: { likeStatus: 'Dislike', parentId: post.postId, isBanned: false },
    });
    //finding the newest likes
    const newestLikes = await this.likePostRepo.find({
      select: ['addedAt', 'userId', 'userLogin'],
      where: { likeStatus: 'Like', parentId: post.postId, isBanned: false },
      order: { addedAt: 'DESC' },
      take: 3,
    });
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(
      countLike,
      countDislike,
      myStatus,
      newestLikes.map(({ userLogin: login, ...rest }) => ({ ...rest, login })),
    );
    return new PostViewModel(
      post.postId,
      post.title,
      post.shortDescription,
      post.content,
      post.blogId,
      post.blogName,
      post.createdAt,
      extendedLikesInfo,
    );
  }

  async findPosts(
    data: PaginationDto,
    userId: string | null,
    blogId?: string,
  ): Promise<PaginationViewModel<PostViewModel[]>> {
    const { sortDirection, sortBy, pageSize, pageNumber } = data;
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
        select: ['postId', 'title', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt'],
        where: filter,
        order: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSize,
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
    return new PaginationViewModel(pagesCountRes, data.pageNumber, data.pageSize, count, itemsPosts);
  }

  async findPost(id: string, userId: string | null): Promise<PostViewModel> {
    //find post by id from uri params
    const post = await this.postRepo.findOneBy({ postId: id, isBanned: false });
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
    //returning post for View
    return this.postForView(post, userId);
  }

  async findCommentsByIdPost(
    postId: string,
    data: PaginationDto,
    userId: string | null,
  ): Promise<PaginationViewModel<CommentsViewType[]>> {
    const { sortDirection, sortBy, pageSize, pageNumber } = data;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    //find post by postId and userId
    const post = await this.postRepo.findOneBy({ postId: postId });
    if (!post) throw new NotFoundExceptionMY(`No content found for current id: ${postId}`);
    const [comments, count] = await Promise.all([
      this.commentRepo.find({
        // relations: { likesComment: true },
        where: { postId: postId, isBanned: false },
        order: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      this.commentRepo.count({ where: { postId: postId, isBanned: false } }),
    ]);
    //mapped comments for View
    const mappedComments = comments.map((object) => this.commentByIdPostForView(object, userId));
    const itemsComments = await Promise.all(mappedComments);
    const pagesCountRes = Math.ceil(count / data.pageSize);
    //returning comment with pagination
    return new PaginationViewModel(pagesCountRes, data.pageNumber, data.pageSize, count, itemsComments);
  }

  private async commentByIdPostForView(object: any, userId: string | null): Promise<CommentsViewType> {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likeCommentRepo.findOneBy({
        userId: userId,
        parentId: object.commentId,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const [countLike, countDislike] = await Promise.all([
      this.likeCommentRepo.count({
        where: { parentId: object.commentId, likeStatus: 'Like', isBanned: false },
      }),
      this.likeCommentRepo.count({
        where: { parentId: object.commentId, likeStatus: 'Dislike', isBanned: false },
      }),
    ]);
    const likesInfo = new LikesInfoViewModel(countLike, countDislike, myStatus);
    return new CommentsViewType(
      object.commentId,
      object.content,
      object.userId,
      object.userLogin,
      object.createdAt,
      likesInfo,
    );
  }

  async createPostForView(id: string): Promise<PostViewModel> {
    const post = await this.postRepo.findOneBy({ postId: id });
    const extendedLikesInfo = new ExtendedLikesInfoViewModel(0, 0, LikeStatusType.None, []);
    //returning created post with extended likes info for View
    return new PostViewModel(
      post.postId,
      post.title,
      post.shortDescription,
      post.content,
      post.blogId,
      post.blogName,
      post.createdAt,
      extendedLikesInfo,
    );
  }

  async getCommentsBloggerForPosts(userId: string, paginationInputModel: PaginationDto) {
    const { sortDirection, sortBy, pageSize, pageNumber } = paginationInputModel;
    let order;
    if (sortDirection === 'asc') {
      order = 'ASC';
    } else {
      order = 'DESC';
    }
    const [comments, count] = await Promise.all([
      this.commentRepo.find({
        select: ['commentId', 'content', 'createdAt', 'userId', 'userLogin'],
        // relations: { post: true, likesComment: true },
        where: { ownerId: userId },
        order: { [sortBy]: order },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      this.commentRepo.count({ where: { ownerId: userId } }),
    ]);
    const mappedPosts = comments.map((object) => this.commentBloggerForPostView(object, userId));
    const items = await Promise.all(mappedPosts);
    // pages count
    const pagesCountRes = Math.ceil(count / pageSize);
    // Found posts with pagination
    return new PaginationViewModel(pagesCountRes, pageNumber, pageSize, count, items);
  }

  private async commentBloggerForPostView(object: any, userId: string) {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likeCommentRepo.findOneBy({
        userId: userId,
        parentId: object.commentId,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const [countLike, countDislike] = await Promise.all([
      this.likeCommentRepo.count({
        where: { parentId: object.commentId, likeStatus: 'Like', isBanned: false },
      }),
      this.likeCommentRepo.count({
        where: { parentId: object.commentId, likeStatus: 'Dislike', isBanned: false },
      }),
    ]);
    const likesInfo = new LikesInfoViewModel(countLike, countDislike, myStatus);
    const commentatorInfo = new CommentatorInfoModel(object.userId, object.userLogin);
    const postInfo = new PostInfoModel(object.post.postId, object.post.title, object.post.blogId, object.post.blogName);
    return new BloggerCommentsViewType(
      object.commentId,
      object.content,
      object.createdAt,
      likesInfo,
      commentatorInfo,
      postInfo,
    );
  }
}
