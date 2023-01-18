import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from '../../domain/post-schema-Model';
import { PaginationDto } from '../../../blogs/api/input-Dtos/pagination-Dto-Model';
import { PostViewModel } from './post-View-Model';
import { LikePost, LikePostDocument, LikeStatusType } from '../../domain/likePost-schema-Model';
import { ExtendedLikesInfoViewModel, LikeDetailsViewModel } from './likes-Info-View-Model';
import { PaginationViewModel } from '../../../blogs/infrastructure/query-repository/pagination-View-Model';
import { ObjectId } from 'mongodb';
import { NotFoundExceptionMY } from '../../../../helpers/My-HttpExceptionFilter';
import { Comment, CommentDocument } from '../../../comments/domain/comments-schema-Model';
import {
  LikeComment,
  LikeCommentDocument,
} from '../../../comments/domain/likeComment-schema-Model';
import {
  BloggerCommentsViewType,
  CommentatorInfoModel,
  CommentsViewType,
  LikesInfoViewModel,
  PostInfoModel,
} from '../../../comments/infrastructure/query-repository/comments-View-Model';
import { BlogBanInfoDocument } from '../../../blogger/domain/ban-user-for-current-blog-schema-Model';
import { BannedBlogUser } from '../../../../entities/banned-blog-user.entity';
import { Post } from '../../../../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsQueryRepositories {
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(LikeComment.name) private readonly likeCommentModel: Model<LikeCommentDocument>,
    @InjectRepository(LikePost)
    private readonly likePostRepository: Repository<LikePost>,
    @InjectModel(BannedBlogUser.name) private readonly blogBanInfoModel: Model<BlogBanInfoDocument>,
  ) {}

  private LikeDetailsView(object: LikePostDocument): LikeDetailsViewModel {
    return new LikeDetailsViewModel(object.addedAt, object.userId, object.login);
  }

  private async commentWithNewId(
    comment: CommentDocument,
    userId: string | null,
  ): Promise<CommentsViewType> {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likeCommentModel.findOne({
        userId: userId,
        parentId: comment._id,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const totalCountLike = await this.likeCommentModel.countDocuments({
      parentId: comment._id,
      likeStatus: 'Like',
      isBanned: false,
    });
    const totalCountDislike = await this.likeCommentModel.countDocuments({
      parentId: comment._id,
      likeStatus: 'Dislike',
      isBanned: false,
    });
    const likesInfo = new LikesInfoViewModel(totalCountLike, totalCountDislike, myStatus);
    return new CommentsViewType(
      comment.id,
      comment.content,
      comment.userId,
      comment.userLogin,
      comment.createdAt,
      likesInfo,
    );
  }

  // private async postForView(post: PostDocument, userId: string | null): Promise<PostViewModel> {
  //   //find likes status
  //   let myStatus: string = LikeStatusType.None;
  //   if (userId) {
  //     const result = await this.likePostModel.findOne({
  //       userId: userId,
  //       parentId: post._id,
  //       isBanned: false,
  //     });
  //     if (result) {
  //       myStatus = result.likeStatus;
  //     }
  //   }
  //   const totalCountLike = await this.likePostModel.countDocuments({
  //     parentId: post._id,
  //     likeStatus: 'Like',
  //     isBanned: false,
  //   });
  //   const totalCountDislike = await this.likePostModel.countDocuments({
  //     parentId: post._id,
  //     likeStatus: 'Dislike',
  //     isBanned: false,
  //   });
  //   //finding the newest likes
  //   const newestLikes = await this.likePostModel
  //     .find({
  //       parentId: post.id,
  //       likeStatus: 'Like',
  //       isBanned: false,
  //     })
  //     .sort({ addedAt: 'desc' })
  //     .limit(3);
  //   //mapped the newest likes for View
  //   const mappedNewestLikes = newestLikes.map((like) => this.LikeDetailsView(like));
  //   //const itemsLikes = await Promise.all(mappedNewestLikes);
  //   const extendedLikesInfo = new ExtendedLikesInfoViewModel(
  //     totalCountLike,
  //     totalCountDislike,
  //     myStatus,
  //     mappedNewestLikes,
  //   );
  //   return new PostViewModel(
  //     post.id,
  //     post.title,
  //     post.shortDescription,
  //     post.content,
  //     post.blogId,
  //     post.blogName,
  //     post.createdAt,
  //     extendedLikesInfo,
  //   );
  // }

  private async postForView(post: any, userId: string | null): Promise<PostViewModel> {
    //find likes status
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likePostRepository.findOneBy({
        userId: userId,
        parentId: post.postId,
        isBanned: false,
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const countLike = await this.likePostRepository.count({
      where: { likeStatus: 'Like', parentId: post.postId, isBanned: false },
    });
    const countDislike = await this.likePostRepository.count({
      where: { likeStatus: 'Dislike', parentId: post.postId, isBanned: false },
    });
    //finding the newest likes
    const newestLikes = await this.likePostRepository.find({
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

  // async findPosts(
  //   data: PaginationDto,
  //   userId: string | null,
  //   blogId?: string,
  // ): Promise<PaginationViewModel<PostViewModel[]>> {
  //   //search all posts with pagination by blogId
  //   const filter = blogId ? { blogId, isBanned: false } : { isBanned: false };
  //   const foundPosts = await this.postModel
  //     .find(filter)
  //     .skip((data.pageNumber - 1) * data.pageSize)
  //     .limit(data.pageSize)
  //     .sort({ [data.sortBy]: data.sortDirection });
  //   //mapped posts for view
  //   const mappedPosts = foundPosts.map((post) => this.postForView(post, userId));
  //   const itemsPosts = await Promise.all(mappedPosts);
  //   //counting posts for blogId
  //   const totalCount = await this.postModel.countDocuments(filter);
  //   //pages count
  //   const pagesCountRes = Math.ceil(totalCount / data.pageSize);
  //   // Found posts with pagination
  //   return new PaginationViewModel(
  //     pagesCountRes,
  //     data.pageNumber,
  //     data.pageSize,
  //     totalCount,
  //     itemsPosts,
  //   );
  // }

  // async findPosts(data: PaginationDto, userId: string | null, blogId?: string,
  // ): Promise<PaginationViewModel<PostViewModel[]>> {
  //   const { sortDirection, sortBy, pageSize, pageNumber } = data;
  //   let order;
  //   if (sortDirection === 'asc') {
  //     order = 'ASC';
  //   } else {
  //     order = 'DESC';
  //   }
  //   let filter;
  //   if (blogId) {
  //     filter = { blogId: blogId, isBanned: false };
  //   } else {
  //     filter = { isBanned: false };
  //   }
  //   const [posts, count] = await Promise.all([
  //     this.postRepo.find({
  //       select: [
  //         'postId',
  //         'title',
  //         'shortDescription',
  //         'content',
  //         'blogId',
  //         'blogName',
  //         'createdAt',
  //       ],
  //       where: filter,
  //       order: { [sortBy]: order },
  //       skip: (pageNumber - 1) * pageSize,
  //       take: pageSize,
  //     }),
  //     this.postRepo.count({ where: filter }),
  //   ]);
  //   //mapped posts for view
  //   const mappedPosts = posts.map((post) => this.postForView(post, userId));
  //   const itemsPosts = await Promise.all(mappedPosts);
  //   //counting blogs user
  //   const pagesCountRes = Math.ceil(count / pageSize);
  //   // Found posts with pagination
  //   return new PaginationViewModel(
  //     pagesCountRes,
  //     data.pageNumber,
  //     data.pageSize,
  //     count,
  //     itemsPosts,
  //   );
  // }

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
        select: [
          'postId',
          'title',
          'shortDescription',
          'content',
          'blogId',
          'blogName',
          'createdAt',
        ],
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
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      count,
      itemsPosts,
    );
  }

  // async findPost(id: string, userId: string | null): Promise<PostViewModel> {
  //   //find post by id from uri params
  //   const post = await this.postModel.findOne({
  //     _id: new ObjectId(id),
  //     isBanned: false,
  //   });
  //
  //   if (!post) throw new NotFoundExceptionMY(`Not found for id: ${id}`);
  //   //returning post for View
  //   return this.postForView(post, userId);
  // }

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
    const filter = { postId: postId, isBanned: false };
    //find post by postId and userId
    const post = await this.findPost(postId, userId);
    if (!post) throw new NotFoundExceptionMY(`Not found for id: ${postId}`);
    //find comment by postId
    const comments = await this.commentModel
      .find(filter)
      .skip((data.pageNumber - 1) * data.pageSize)
      .limit(data.pageSize)
      .sort({ [data.sortBy]: data.sortDirection });
    const mappedComments = comments.map((comment) => this.commentWithNewId(comment, userId));
    const itemsComments = await Promise.all(mappedComments);
    //counting comments
    const totalCountComments = await this.commentModel.countDocuments(
      postId ? { postId, isBanned: false } : { isBanned: false },
    );
    const pagesCountRes = Math.ceil(totalCountComments / data.pageSize);
    //returning comment with pagination
    return new PaginationViewModel(
      pagesCountRes,
      data.pageNumber,
      data.pageSize,
      totalCountComments,
      itemsComments,
    );
  }

  // async createPostForView(post: PostDocument): Promise<PostViewModel> {
  //   const postId = post.id;
  //   const newestLikes = await this.likePostModel
  //     .find({ parentId: postId, likeStatus: 'Like', isBanned: false })
  //     .sort({ addedAt: 'desc' })
  //     .limit(3);
  //   const mappedNewestLikes = newestLikes.map((like) => this.LikeDetailsView(like));
  //   //const itemsLikes = await Promise.all(mappedNewestLikes);
  //   const extendedLikesInfo = new ExtendedLikesInfoViewModel(
  //     0,
  //     0,
  //     LikeStatusType.None,
  //     mappedNewestLikes,
  //   );
  //   //returning created post with extended likes info for View
  //   return new PostViewModel(
  //     post._id.toString(),
  //     post.title,
  //     post.shortDescription,
  //     post.content,
  //     post.blogId,
  //     post.blogName,
  //     post.createdAt,
  //     extendedLikesInfo,
  //   );
  // }

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

  async findCommentsBloggerForPosts(userId: string, paginationInputModel: PaginationDto) {
    const { sortDirection, sortBy, pageSize, pageNumber } = paginationInputModel;
    //search all comments with pagination
    const foundComments = await this.commentModel
      .find({ ownerId: userId })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });
    //mapped posts for view
    const mappedPosts = foundComments.map((comment) =>
      this.bloggerCommentViewModel(comment, userId),
    );
    const items = await Promise.all(mappedPosts);
    const totalCount = await this.commentModel.countDocuments({ ownerId: userId });
    //pages count
    const pagesCountRes = Math.ceil(totalCount / pageSize);
    // Found posts with pagination
    return new PaginationViewModel(pagesCountRes, pageNumber, pageSize, totalCount, items);
  }

  private async bloggerCommentViewModel(comment: CommentDocument, userId: string | null) {
    let myStatus: string = LikeStatusType.None;
    if (userId) {
      const result = await this.likeCommentModel.findOne({
        userId: userId,
        parentId: comment._id.toString(),
      });
      if (result) {
        myStatus = result.likeStatus;
      }
    }
    const totalCountLike = await this.likeCommentModel.countDocuments({
      parentId: comment.id,
      likeStatus: 'Like',
      isBanned: false,
    });
    const totalCountDislike = await this.likeCommentModel.countDocuments({
      parentId: comment.id,
      likeStatus: 'Dislike',
      isBanned: false,
    });
    const likesInfo = new LikesInfoViewModel(totalCountLike, totalCountDislike, myStatus);

    const post = await this.postModel.findOne({ _id: new Object(comment.postId) });
    const commentatorInfo = new CommentatorInfoModel(comment.userId, comment.userLogin);
    const postInfo = new PostInfoModel(post.id, post.title, post.blogId, post.blogName);
    return new BloggerCommentsViewType(
      comment.id,
      comment.content,
      comment.createdAt,
      likesInfo,
      commentatorInfo,
      postInfo,
    );
  }
}
