import { Injectable } from '@nestjs/common';
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../../config/configuration';

@Injectable()
export class S3StorageAdapter {
  s3Client: S3Client;
  constructor(private configService: ConfigService<ConfigType>) {
    const secret = this.configService.get('aws', { infer: true });
    // Set the AWS Region.
    const REGION = 'eu-central-1';
    // Create an Amazon S3 service client object.
    this.s3Client = new S3Client({
      region: REGION,
      // endpoint: 'http://bee-brick.s3-website.eu-central-1.amazonaws.com', //https://dynamodb.us-west-2.amazonaws.com
      credentials: {
        secretAccessKey: secret.SECRET_ACCESS_KEY,
        accessKeyId: secret.ACCESS_KEY_ID,
      },
    });
  }

  async saveFile(userId: string, photo: Buffer) {
    const bucket = this.configService.get('aws', { infer: true }).BUCKET;
    const bucketParams = {
      Bucket: bucket,
      // Specify the name of the new object. For example, 'index.html'.
      // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
      Key: `-------photos/${userId}/wallpaper-blog/${userId}.png`,
      // Content of the new object.
      Body: photo,
      ContentType: 'image/png',
    };
    const command = new PutObjectCommand(bucketParams);
    console.log('command', command.input);
    try {
      const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
      console.log('--+_+uploadResult', uploadResult);
      return;
    } catch (e) {
      console.error(e);
    }
  }

  async delete(fileId: string) {
    // await fs.unlinkSync(fileId);
    return;
  }
}
