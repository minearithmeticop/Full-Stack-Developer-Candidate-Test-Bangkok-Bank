import { Injectable } from '@nestjs/common';
import { UserProfile } from '../auth/jwt.strategy';

export interface MeResponseDto {
  id: string;
  email?: string;
  emailVerified?: boolean;
}

@Injectable()
export class MeService {
  getProfile(user: UserProfile): MeResponseDto {
    return {
      id: user.id || user.sub,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }
}
