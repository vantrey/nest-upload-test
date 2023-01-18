import { HydratedDocument } from "mongoose";
import { Prop, Schema } from "@nestjs/mongoose";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { User } from "../../../entities/user.entity";


class AccountData {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;

  constructor(login: string,
              email: string,
              passwordHash: string) {
    this.login = login;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = new Date().toISOString();
  }
}

class EmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmation: boolean;

  constructor(isConfirmation: boolean) {
    this.confirmationCode = randomUUID();
    this.expirationDate = add(new Date(), { hours: 1 });
    this.isConfirmation = isConfirmation;
  }
}

class EmailRecovery {
  recoveryCode: string;
  expirationDate: Date;
  isConfirmation: boolean;

  constructor() {
    this.recoveryCode = randomUUID();
    this.expirationDate = add(new Date(), { hours: 1 });
    this.isConfirmation = false;
  }
}

// export class UserBanInfo {
//   isBanned: boolean;
//   banDate: string;
//   banReason: string;
//
//   constructor() {
//     this.isBanned = false;
//     this.banDate = null;
//     this.banReason = null;
//   }
// }


// export type UserDocument = HydratedDocument<User>;

// export const UserSchema = SchemaFactory.createForClass(User);
//
// UserSchema.methods = {
//   updateStatusConfirmCode: User.prototype.updateStatusConfirmCode,
//   checkingConfirmCode: User.prototype.checkingConfirmCode,
//   updateRecoveryCode: User.prototype.updateRecoveryCode,
//   updateConfirmCode: User.prototype.updateConfirmCode,
//   comparePassword: User.prototype.comparePassword,
//   checkStatusBan: User.prototype.checkStatusBan,
//   updatePassword: User.prototype.updatePassword,
//   checkingEmail: User.prototype.checkingEmail,
//   unblockUser: User.prototype.unblockUser,
//   getEmail: User.prototype.getEmail,
//   getLogin: User.prototype.getLogin,
//   banUser: User.prototype.banUser
// };


