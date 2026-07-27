import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserProfile } from '../auth/jwt.strategy';
import { MeResponseDto, MeService } from './me.service';

@Controller('api/v1/me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  getProfile(@CurrentUser() user: UserProfile): MeResponseDto {
    return this.meService.getProfile(user);
  }
}
