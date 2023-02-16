export class BlogImagesViewModel {
  wallpaper: PhotoSizeModel;
  /**
   * @param main -> Must contain original photo size (156x156) and small photo size (48x48)
   */
  main: PhotoSizeModel[];

  constructor(wallpaper: PhotoSizeModel, main: PhotoSizeModel[]) {
    this.wallpaper = wallpaper;
    this.main = main;
  }
}

export class PhotoSizeModel {
  public url: string;
  /**
   * In pixels
   */
  public width: number;
  /**
   * In pixels
   */
  public height: number;
  /**
   * In bytes
   */
  public fileSize: number;

  constructor(url: string, width: number, height: number, fileSize: number) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
  }
}
