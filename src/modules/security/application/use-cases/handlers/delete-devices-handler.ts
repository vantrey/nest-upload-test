import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDevicesCommand } from '../delete-devices-command';
import { DeviceRepositories } from '../../../infrastructure/device-repositories';

@CommandHandler(DeleteDevicesCommand)
export class DeleteDevicesHandler implements ICommandHandler<DeleteDevicesCommand> {
  constructor(private readonly deviceRepo: DeviceRepositories) {}

  async execute(command: DeleteDevicesCommand): Promise<boolean> {
    const { userId, deviceId } = command.payloadRefresh;
    await this.deviceRepo.deleteDevices(userId, deviceId);
    return true;
  }
}
