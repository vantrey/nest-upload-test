import { Injectable } from '@nestjs/common';
import { User } from '../../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async saveUser(createdUser: User): Promise<string> {
    const user = await this.userRepo.save(createdUser);
    return user.id;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .delete()
          .from('user')
          .where('userId = :id', { id })
          .execute();
        // await manager.createQueryBuilder()
        //   .delete()
        //   .from("email_confirmation")
        //   .where("userId = :id", { id })
        //   .execute();
        // await manager.createQueryBuilder()
        //   .delete()
        //   .from("email_recovery")
        //   .where("userId = :id", { id })
        //   .execute();
      })
      .catch((e) => {
        return console.log(e);
      });
    return true;
  }

  // async findByLoginOrEmail(loginOrEmail: string): Promise<User> {
  //   return this.userModel.findOne({
  //     $or: [{ 'accountData.email': loginOrEmail }, { 'accountData.login': loginOrEmail }],
  //   });
  // }
  async findByLoginOrEmail(loginOrEmail: string): Promise<User> {
    return this.userRepo.findOneBy([{ login: loginOrEmail }, { email: loginOrEmail }]);
  }

  // async findUserByConfirmationCode(confirmationCode: string): Promise<UserDocument> {
  //   return this.userModel.findOne({
  //     'emailConfirmation.confirmationCode': confirmationCode,
  //   });
  // }
  async findUserByConfirmationCode(confirmationCode: string): Promise<User> {
    return this.userRepo.findOneBy({ confirmationCode: confirmationCode });
  }

  // async findUserByRecoveryCode(recoveryCode: string): Promise<UserDocument> {
  //   return this.userModel.findOne({
  //     'emailRecovery.recoveryCode': recoveryCode,
  //   });
  // }
  async findUserByRecoveryCode(recoveryCode: string): Promise<User> {
    return await this.userRepo.findOneBy({ recoveryCode: recoveryCode });
  }

  async findUserByIdWithMapped(userId: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return null;
    return user;
  }
}

/* async updateConfirmation(_id: ObjectId): Promise<boolean> {
   const result = await this.userModel.updateOne(
     { _id: _id },
     {
       $set: { "emailConfirmation.isConfirmation": true }
     }
   );
   return result.modifiedCount === 1;
 }

 async updateCodeRecovery(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
   const result = await this.userModel.updateOne(
     { _id: _id },
     {
       $set: {
         "emailRecovery.recoveryCode": code,
         "emailRecovery.expirationDate": expirationDate
       }
     }
   );
   return result.modifiedCount === 1;
 }

 async updateRecovery(_id: ObjectId, passwordHash: string): Promise<boolean> {
   const result = await this.userModel.updateOne(
     { _id: _id },
     {
       $set: {
         "accountData.passwordHash": passwordHash,
         "emailRecovery.isConfirmation": true
       }
     }
   );
   return result.modifiedCount === 1;
 }

 async updateCodeConfirmation(_id: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
   const result = await this.userModel.updateOne(
     { _id: _id },
     {
       $set: {
         "emailConfirmation.confirmationCode": code,
         "emailConfirmation.expirationDate": expirationDate
       }
     }
   );
   return result.modifiedCount === 1;
 }

 async updateBanInfoUser(userId: string, isBanned: boolean, banDate: string, banReason: string): Promise<boolean> {
   const result = await this.userModel.updateOne({ _id: new Object(userId) },
     { $set: { "banInfo.isBanned": isBanned, "banInfo.banDate": banDate, "banInfo.banReason": banReason } }
   );
   return result.modifiedCount === 1;
 }

 async findBanStatusUser(userId: string): Promise<UserDocument> {
   const banStatus = await this.userModel.findOne({ userId: userId });
   if (!banStatus) return null;
   return banStatus;
 }*/
