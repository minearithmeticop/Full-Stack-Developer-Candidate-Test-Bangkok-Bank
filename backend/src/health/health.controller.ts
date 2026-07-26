import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

export interface HealthStatusResponse {
  status: string;
  timestamp: string;
}

@Controller()
export class HealthController {
  @Public()
  @Get('health')
  getHealth(): HealthStatusResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
