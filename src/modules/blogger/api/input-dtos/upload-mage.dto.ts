import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ImageFile } from './image-file.dto';

export class UploadImageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => ImageFile)
  public image: ImageFile;
}

/*@Post()
  @UseInterceptors(FileInterceptor('image'))
  async upload(@UploadedFile() file: UploadImageDto) {
    console.log(file); // The file will be validated by class-validator and class-transformer
  }*/
