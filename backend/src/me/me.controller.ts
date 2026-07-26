import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt.strategy';
import { MeService } from './me.service';

@Controller('api/v1/me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  getProfile(@CurrentUser() user: JwtPayload): JwtPayload {
    return this.meService.getProfile(user);
  }
}
