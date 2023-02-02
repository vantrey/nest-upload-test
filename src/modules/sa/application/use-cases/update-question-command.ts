import { CreateQuestionDto } from '../../api/input-dtos/create-Question.dto';

export class UpdateQuestionCommand {
  constructor(public readonly id: string, public readonly questionInputModel: CreateQuestionDto) {}
}
