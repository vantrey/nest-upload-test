import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundExceptionMY } from '../../../../../helpers/My-HttpExceptionFilter';
import { UpdateQuestionCommand } from '../update-question.command';
import { QuestionRepository } from '../../../infrastructure/question.reposit';

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler implements ICommandHandler<UpdateQuestionCommand> {
  constructor(private readonly questionRepo: QuestionRepository) {}

  async execute(command: UpdateQuestionCommand): Promise<boolean> {
    const { body, correctAnswers } = command.questionInputModel;
    const id = command.id;
    const question = await this.questionRepo.findQuestionByIdWithMapped(id);
    if (!question) throw new NotFoundExceptionMY(`Not found blog with id: ${id}`);
    question.updateValue(body, correctAnswers);
    await this.questionRepo.saveQuestion(question);
    return true;
  }
}
