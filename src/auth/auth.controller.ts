import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('verify')
  async verifyPhone(@Body('token') token: string) {
    const { uid, phone_number } =
      await this.authService.verifyFirebaseToken(token);
    const existingUser =
      await this.usersService.findByPhoneNumber(phone_number);

    if (existingUser) {
      return {
        user: existingUser,
        requiresProfileSetup: false,
      };
    }

    return {
      tempUser: { phoneNumber: phone_number, firebaseUid: uid },
      requiresProfileSetup: true,
    };
  }
}
