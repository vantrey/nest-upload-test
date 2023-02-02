import { AnswerDto } from '../../api/input-dtos/create-answer.dto';

export class AnswerQuizCommand {
  constructor(public readonly userId: string, public readonly inputAnswerModel: AnswerDto) {}
}
