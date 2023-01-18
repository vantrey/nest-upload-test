import { Injectable } from '@nestjs/common';
import { Device } from '../../../entities/device.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeviceRepositories {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,
  ) {}

  async saveDevice(device: Device) {
    const createdDevice = await this.deviceRepo.save(device);
    return createdDevice.deviceId;
  }

  async deleteDevice(userId: string, deviceId: string): Promise<boolean> {
    await this.deviceRepo.delete({ userId: userId, deviceId: deviceId }).catch((e) => {
      console.log(e);
    });
    return true;
  }

  async deleteDevices(userId: string, deviceId: string): Promise<boolean> {
    await this.deviceRepo.manager.connection
      .transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .delete()
          .from(Device)
          .where('userId = :id AND deviceId != :id2', { id: userId, id2: deviceId })
          .execute();
      })
      .catch((e) => {
        console.log(e);
      });
    return true;
  }

  async deleteDevicesForBannedUser(userId: string): Promise<boolean> {
    await this.deviceRepo.delete({ userId: userId }).catch((e) => {
      console.log(e);
    });
    return true;
  }

  async findByDeviceIdAndUserId(userId: string, deviceId: string): Promise<Device> {
    return await this.deviceRepo.findOneBy({ userId: userId, deviceId: deviceId });
  }

  async deleteDeviceByDeviceId(deviceId: string): Promise<boolean> {
    await this.deviceRepo.manager.connection
      .transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .delete()
          .from(Device)
          .where('deviceId = :id', { id: deviceId })
          .execute();
      })
      .catch((e) => {
        console.log(e);
      });
    return true;
  }

  async findDeviceForValid(userId: string, deviceId: string, iat: number): Promise<Device> {
    let dateCreateToken = new Date(iat * 1000).toISOString();
    const devices = await this.deviceRepo.findOneBy({
      userId: userId,
      deviceId: deviceId,
      lastActiveDate: dateCreateToken,
    });
    if (!devices) {
      return null;
    } else {
      return devices;
    }
  }

  async findDeviceByDeviceId(deviceId: string): Promise<Device> {
    const device = await this.deviceRepo.findOneBy({ deviceId: deviceId }).catch((e) => {
      console.log(e);
      return null;
    });
    if (!device) {
      return null;
    } else {
      return device;
    }
  }

  async findForUpdateDateDevice(
    userId: string,
    deviceId: string,
    dateCreatedOldToken: string,
  ): Promise<Device> {
    return await this.deviceRepo.findOneBy({
      userId: userId,
      deviceId: deviceId,
      lastActiveDate: dateCreatedOldToken,
    });
  }

  async findDeviceForDelete(
    userId: string,
    deviceId: string,
    dateCreatedToken: string,
  ): Promise<Device> {
    return await this.deviceRepo.findOne({
      where: {
        userId: userId,
        deviceId: deviceId,
        lastActiveDate: dateCreatedToken,
      },
    });
  }
}
