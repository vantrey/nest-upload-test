import { IsString } from 'class-validator';
import { Trim } from '../../../../helpers/decorator-trim';

export class AnswerDto {
  /**
   * answer: Text of answer, for example: 'free'
   */
  @Trim()
  @IsString()
  answer: string;
}
