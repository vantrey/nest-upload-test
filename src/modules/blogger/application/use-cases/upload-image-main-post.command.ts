export class UploadImageMainPostCommand {
  constructor(
    public readonly userId: string,
    public readonly blogId: string,
    public readonly postId: string,
    public readonly originalname: string,
    public readonly photo: Buffer,
  ) {}
}
