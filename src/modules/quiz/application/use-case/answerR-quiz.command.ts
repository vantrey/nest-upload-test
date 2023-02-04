import { AnswerDto } from '../../api/input-dtos/create-answer.dto';

export class AnswerRQuizCommand {
  constructor(public readonly userId: string, public readonly inputAnswerModel: AnswerDto) {}
}
