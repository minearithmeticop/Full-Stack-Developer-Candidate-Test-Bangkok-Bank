import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt.strategy';

@Injectable()
export class MeService {
  getProfile(user: JwtPayload): JwtPayload {
    // TODO: Implemented profile retrieval logic
    return user;
  }
}
