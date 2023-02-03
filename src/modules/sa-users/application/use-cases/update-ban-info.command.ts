import { UpdateBanInfoDto } from '../../api/input-Dto/update-ban-info.dto';

export class UpdateBanInfoCommand {
  constructor(public readonly updateBanInfoModel: UpdateBanInfoDto, public readonly userId: string) {}
}
