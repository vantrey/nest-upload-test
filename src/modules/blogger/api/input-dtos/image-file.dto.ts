import { IsNotEmpty, IsNumber } from 'class-validator';

export class ImageFile {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public data: Buffer;

  @IsNumber()
  public size: number;
}
