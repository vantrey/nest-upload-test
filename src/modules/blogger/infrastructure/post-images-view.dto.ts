import { PhotoSizeModel } from './blog-images-view.dto';

export class PostImagesViewModel {
  /**
   * @param main -> Must contain original photo size (940x432) and middle photo (300x180) and small (149x96)
   */
  main: PhotoSizeModel[];
  constructor(main: PhotoSizeModel[]) {
    this.main = main;
  }
}
