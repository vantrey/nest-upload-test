import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../create-question-command';
import { Question } from '../../../../../entities/question.entity';
import { QuestionRepository } from '../../../infrastructure/question.reposit';
import { QuestionQueryRepository } from '../../../infrastructure/query-reposirory/question-query.reposit';
import { QuestionViewModel } from '../../../infrastructure/query-reposirory/question-View-Model';

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(
    private readonly questionRepo: QuestionRepository,
    private readonly questionQueryRepo: QuestionQueryRepository,
  ) {}

  async execute(command: CreateQuestionCommand): Promise<QuestionViewModel> {
    const { body, correctAnswers } = command.questionInputModel;
    //create instance
    const question = Question.createQuestion(body, correctAnswers);
    //save
    const questionId = await this.questionRepo.saveQuestion(question);
    return await this.questionQueryRepo.findQuestion(questionId);
  }
}
