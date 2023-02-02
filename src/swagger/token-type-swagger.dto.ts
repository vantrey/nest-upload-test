import { PickType } from '@nestjs/swagger';
import { TokensType } from '../modules/auth/application/tokensType.dto';

export class TokenTypeSwaggerDto extends PickType(TokensType, ['accessToken'] as const) {}
