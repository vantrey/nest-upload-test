import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import sharp, { Metadata } from 'sharp';
import { Post } from './post.entity';

@Entity()
export class ImagePost {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  postId: string;
  @Column({ type: 'uuid' })
  userId: string;

  //---image 490x432 -----------
  @Column({ type: 'character varying', default: null })
  keyImageMain: string;
  @Column({ type: 'int', default: null })
  sizeMainImage: number;
  @Column({ type: 'character varying', default: null })
  fieldIdImageMain: string;
  @Column({ type: 'timestamptz', default: null })
  createdAtImageMain: Date; //Date when first player initialized the pair

  //---image 300x180 -----------
  @Column({ type: 'character varying', default: null })
  keyMiddleImageMain: string;
  @Column({ type: 'int', default: null })
  sizeMiddleImageMain: number;
  @Column({ type: 'character varying', default: null })
  fieldIdMiddleImageMain: string;
  @Column({ type: 'timestamptz', default: null })
  createdAtMiddleImageMain: Date; //Date when first player initialized the pair

  //---image 149x96 -----------
  @Column({ type: 'character varying', default: null })
  keySmallImageMain: string;
  @Column({ type: 'int', default: null })
  sizeSmallImageMain: number;
  @Column({ type: 'character varying', default: null })
  fieldIdSmallImageMain: string;
  @Column({ type: 'timestamptz', default: null })
  createdAtSmallImageMain: Date; //Date when first player initialized the pair

  @OneToOne(() => Post, (b) => b.image)
  post: Post;

  constructor(userId: string, postId: string, post?: Post) {
    this.userId = userId;
    this.postId = postId;
    this.post = post;
  }

  static createImagePost(userId: string, postId: string, post?: Post) {
    return new ImagePost(userId, postId, post);
  }

  async setImageMain(
    urlImageMain: { key: string; fieldId: string },
    urlMiddleImageMain: { key: string; fieldId: string },
    urlSmallImageMain: { key: string; fieldId: string },
    photo: Buffer,
    middlePhoto: Buffer,
    smallPhoto: Buffer,
  ): Promise<ImagePost> {
    await this.checkingBufferImage490(photo);
    await this.checkingBufferImage300(middlePhoto);
    await this.checkingBufferImage149(smallPhoto);
    const metadataImage = await this.setMetadata(photo);
    const metadataMiddleImage = await this.setMetadata(middlePhoto);
    const metadataSmallImage = await this.setMetadata(smallPhoto);
    this.setValueImageMain(urlImageMain.key, urlImageMain.fieldId, metadataImage);
    this.setValueImageMiddleMain(urlMiddleImageMain.key, urlMiddleImageMain.fieldId, metadataMiddleImage);
    this.setValueImageSmallMain(urlSmallImageMain.key, urlSmallImageMain.fieldId, metadataSmallImage);
    return this;
  }

  private async checkingBufferImage490(file: Buffer) {
    //default settings
    const contentTypes = ['png', 'jpg', 'jpeg'];
    const defaultSize = 100000; //Total size of image in bytes, for Stream and Buffer input only
    const defaultWidth = 940; //Number of pixels wide (EXIF orientation is not taken into consideration)
    const defaultHeight = 432; //Number of pixels high (EXIF orientation is not taken into consideration)
    //checking type
    const metadata: Metadata = await this.setMetadata(file);
    this.checkMetadataImage(contentTypes, defaultSize, defaultWidth, defaultHeight, metadata);
    return;
  }

  private async checkingBufferImage300(file: Buffer) {
    //default settings
    const contentTypes = ['png', 'jpg', 'jpeg'];
    const defaultSize = 100000; //Total size of image in bytes, for Stream and Buffer input only
    const defaultWidth = 300; //Number of pixels wide (EXIF orientation is not taken into consideration)
    const defaultHeight = 180; //Number of pixels high (EXIF orientation is not taken into consideration)
    //checking type
    const metadata: Metadata = await this.setMetadata(file);
    this.checkMetadataImage(contentTypes, defaultSize, defaultWidth, defaultHeight, metadata);
    return;
  }

  private async checkingBufferImage149(file: Buffer) {
    //default settings
    const contentTypes = ['png', 'jpg', 'jpeg'];
    const defaultSize = 100000; //Total size of image in bytes, for Stream and Buffer input only
    const defaultWidth = 149; //Number of pixels wide (EXIF orientation is not taken into consideration)
    const defaultHeight = 96; //Number of pixels high (EXIF orientation is not taken into consideration)
    //checking type
    const metadata: Metadata = await this.setMetadata(file);
    this.checkMetadataImage(contentTypes, defaultSize, defaultWidth, defaultHeight, metadata);
    return;
  }

  private checkMetadataImage(
    contentTypes: string[],
    defaultSize: number,
    defaultWidth: number,
    defaultHeight: number,
    metadata: sharp.Metadata,
  ) {
    const inputMimeType = metadata.format.split(' ');
    if (metadata.size > defaultSize || !contentTypes.includes(inputMimeType[0])) {
      throw new Error(`The file format is incorrect, please upload the correct file`);
    }
    // checking "width" and "height
    if (metadata.width !== defaultWidth && metadata.height !== defaultHeight) {
      throw new Error(`The file format is incorrect, please upload the correct file`);
    }
    return;
  }

  private async setMetadata(file: Buffer): Promise<Metadata> {
    return await sharp(file).metadata();
  }

  private setValueImageMain(key: string, fieldId: string, metadataMainImage: sharp.Metadata) {
    this.keyImageMain = key;
    this.fieldIdImageMain = fieldId;
    this.sizeMainImage = metadataMainImage.size;
    this.createdAtImageMain = new Date();
  }
  private setValueImageMiddleMain(key: string, fieldId: string, metadataMainImage: sharp.Metadata) {
    this.keyMiddleImageMain = key;
    this.fieldIdMiddleImageMain = fieldId;
    this.sizeMiddleImageMain = metadataMainImage.size;
    this.createdAtMiddleImageMain = new Date();
  }
  private setValueImageSmallMain(key: string, fieldId: string, metadataMainImage: sharp.Metadata) {
    this.keySmallImageMain = key;
    this.fieldIdSmallImageMain = fieldId;
    this.sizeSmallImageMain = metadataMainImage.size;
    this.createdAtSmallImageMain = new Date();
  }
}
