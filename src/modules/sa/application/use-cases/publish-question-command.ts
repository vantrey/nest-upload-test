import { PublisherQuestionDto } from '../../api/input-dtos/publisher-question.dto';

export class PublishQuestionCommand {
  constructor(public readonly id: string, public readonly questionInputModel: PublisherQuestionDto) {}
}
