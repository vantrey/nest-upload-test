import { Injectable } from '@nestjs/common';
import {
  DeleteBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../../config/configuration';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { reSizeImage } from '../../../helpers/re-size.image';

@Injectable()
export class S3StorageAdapter {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor(private configService: ConfigService<ConfigType>) {
    const secret = this.configService.get('aws', { infer: true });
    this.bucket = this.configService.get('aws', { infer: true }).BUCKET;
    this.endpoint = this.configService.get('aws', { infer: true }).ENDPOINT;
    // Set the AWS Region.
    const REGION = 'eu-central-1';
    // Create an Amazon S3 service client object.
    this.s3Client = new S3Client({
      region: REGION,
      // endpoint: 'https://bee-brick.s3.eu-central-1.amazonaws.com',
      credentials: {
        secretAccessKey: secret.SECRET_ACCESS_KEY,
        accessKeyId: secret.ACCESS_KEY_ID,
      },
    });
  }

  async saveFile(userId: string, photo: Buffer, key: string) {
    const bucketParams = {
      Bucket: this.bucket,
      // Specify the name of the new object. For example, 'index.html'.
      // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
      Key: key,
      // Content of the new object.
      Body: photo,
      ContentType: 'image/png',
    };
    const command = new PutObjectCommand(bucketParams);
    const getCommand = new GetObjectCommand(bucketParams);
    // console.log('endpoint', this.endpoint);
    // console.log('bucketParams.Key', bucketParams.Key);
    try {
      const uploadResult: PutObjectCommandOutput = await this.s3Client.send(command);
      // const uploadResultGet: GetObjectCommandOutput = await this.s3Client.send(getCommand);
      // console.log('Successfully uploaded object: ' + bucketParams.Bucket + '/' + bucketParams.Key);
      // const url = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 14400 });
      return {
        // url: url,
        key: `${this.endpoint}/${key}`,
        fieldId: uploadResult.ETag.slice(1, -1),
      };
    } catch (e) {
      console.error('aws err', e);
    }
  }

  async delete(userId: string, key: string) {
    const delete_bucket_params = {
      Bucket: this.bucket,
      Key: key,
    };
    try {
      const data = await this.s3Client.send(new DeleteObjectCommand(delete_bucket_params));
      // console.log('Success. Object deleted.', data);
      return data; // For unit tests.
    } catch (err) {
      console.error('Error', err);
    }
  }
}

/*
 const download_bucket_params = {
      Bucket: bucket,
      Key: `-------photos/${userId}/wallpaper-blog/${userId}.png`,
    };
const data = await this.s3Client.send(new GetObjectCommand(download_bucket_params));
      // Create a helper function to convert a ReadableStream into a string.
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('error', reject);
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
      const bodyContents = await streamToString(data.Body);
      console.log(bodyContents);*/
