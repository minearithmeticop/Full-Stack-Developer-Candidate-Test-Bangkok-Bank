import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

export interface UserProfile {
  id: string;
  sub: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const domain =
      configService.get<string>('AUTH0_DOMAIN') || 'dev-yg.us.auth0.com';
    const audience =
      configService.get<string>('AUTH0_AUDIENCE') ||
      'https://bbl-candidate-test-api';

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any): UserProfile {
    return {
      id: payload.sub,
      sub: payload.sub,
      email: payload.email || payload['https://bbl-candidate-test-api/email'],
      emailVerified:
        payload.email_verified ??
        payload['https://bbl-candidate-test-api/email_verified'] ??
        false,
      name: payload.name,
      picture: payload.picture,
    };
  }
}
