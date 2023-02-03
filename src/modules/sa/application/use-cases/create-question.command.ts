import { CreateQuestionDto } from '../../api/input-dtos/create-Question.dto';

export class CreateQuestionCommand {
  constructor(public readonly questionInputModel: CreateQuestionDto) {}
}
