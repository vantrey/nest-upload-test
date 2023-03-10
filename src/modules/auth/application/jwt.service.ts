import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedExceptionMY } from '../../../helpers/My-HttpExceptionFilter';
import { PayloadType } from './payloadType';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../../../config/configuration';
import { TokensType } from './tokensType.dto';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService<ConfigType>) {}

  async createJwt(userId: string, deviceId: string): Promise<TokensType> {
    const secret = this.configService.get('tokens', { infer: true });
    const accessToken = jwt.sign({ userId: userId }, secret.ACCESS_TOKEN_SECRET, {
      expiresIn: secret.EXPIRED_REFRESH,
    });
    const refreshToken = jwt.sign({ userId: userId, deviceId: deviceId }, secret.REFRESH_TOKEN_SECRET, {
      expiresIn: secret.EXPIRED_ACCESS,
    });
    return new TokensType(accessToken, refreshToken);
  }

  async verifyRefreshToken(refreshToken: string): Promise<PayloadType> {
    try {
      const secret = this.configService.get('tokens', { infer: true });
      const result: any = jwt.verify(refreshToken, secret.REFRESH_TOKEN_SECRET);
      return result;
    } catch (error) {
      throw new UnauthorizedExceptionMY(`Unauthorized user`);
    }
  }

  async getUserIdByToken(token: string): Promise<string> {
    try {
      const secret = this.configService.get('tokens', { infer: true });
      const result: any = jwt.verify(token, secret.ACCESS_TOKEN_SECRET);
      return result.userId;
    } catch (error) {
      return null;
      //throw new UnauthorizedExceptionMY(`Unauthorized user`);
    }
  }
}
