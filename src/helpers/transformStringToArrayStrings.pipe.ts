import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TransformStringToArrayStringsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // if (!value) return (value = ['avgScores desc', 'sumScore desc']);
    if (value === 'string') return value.split(',');
    return value;
  }
}
