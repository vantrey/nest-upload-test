import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../create-post-command';
import { PostViewModel } from '../../../../posts/infrastructure/query-repositories/post-View-Model';
import { PostsRepositories } from '../../../../posts/infrastructure/posts-repositories';
import { PostsQueryRepositories } from '../../../../posts/infrastructure/query-repositories/posts-query.reposit';
import {
  ForbiddenExceptionMY,
  NotFoundExceptionMY,
} from '../../../../../helpers/My-HttpExceptionFilter';
import { BlogsRepositories } from '../../../../blogs/infrastructure/blogs.repositories';
import { Post } from '../../../../../entities/post.entity';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepositories,
    private readonly postsRepo: PostsRepositories,
    private readonly postsQueryRepo: PostsQueryRepositories,
  ) {}

  async execute(command: CreatePostCommand): Promise<PostViewModel> {
    const { userId, blogId } = command;
    const { title, shortDescription, content } = command.postInputModel;
    const blog = await this.blogsRepo.findBlog(blogId);
    if (!blog) throw new NotFoundExceptionMY(`Not found blog with id: ${blogId}`);
    if (!blog.checkOwner(userId))
      throw new ForbiddenExceptionMY(`You are not the owner of the blog`);
    if (blog.checkStatusBan()) throw new NotFoundExceptionMY(`Not found data for id: ${blogId}`);
    //preparation post
    const newPost = Post.createPost(
      userId,
      title,
      shortDescription,
      content,
      blogId,
      blog.getName(),
      blog,
    );
    //save instance
    const createdPost = await this.postsRepo.savePost(newPost);
    //mapped for view
    return await this.postsQueryRepo.createPostForView(createdPost.postId);
  }
}
