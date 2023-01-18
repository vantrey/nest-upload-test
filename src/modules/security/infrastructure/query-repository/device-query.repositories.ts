import { Injectable } from '@nestjs/common';
import { DeviceViewModel } from './device-View-Model';
import { Device } from '../../../../entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceQueryRepositories {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  // private deviceForView(object: Device): DeviceViewModel {
  //   return new DeviceViewModel(object.ip, object.title, object.lastActiveDate, object.deviceId);
  // }

  // async findDevices(userId: string): Promise<DeviceViewModel[]> {
  //   const devices = await this.deviceModel.find({ userId: userId });
  //   if (!devices) {
  //     throw new Error('server all');
  //   } else {
  //     return devices.map((device) => this.deviceForView(device));
  //   }
  // }
  async findDevices(userId: string): Promise<DeviceViewModel[]> {
    return await this.deviceRepo.find({
      select: ['ip', 'title', 'lastActiveDate', 'deviceId'],
      where: { userId: userId },
    });
  }
}
