import { UpdateLikeStatusDto } from '../../api/input-Dtos/update-Like-Status.dto';

export class UpdateLikeStatusCommand {
  constructor(
    public readonly id: string,
    public readonly updateLikeStatusInputModel: UpdateLikeStatusDto,
    public readonly userId: string,
  ) {}
}
