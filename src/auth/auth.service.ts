// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateAuthToken(user: any) {
    const payload = {
      sub: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async generateTempToken(phoneNumber: string) {
    const payload = {
      sub: phoneNumber,
      purpose: 'registration',
      // exp: Math.floor(Date.now() / 1000) + 60 * 15, // 15 minutes expiration
    };
    return this.jwtService.sign(payload);
  }

  async verifyTempToken(tempToken: string) {
    try {
      const decoded = this.jwtService.verify(tempToken);
      if (decoded.purpose !== 'registration') {
        throw new Error('Invalid token purpose');
      }
      return decoded.sub; // phoneNumber
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
