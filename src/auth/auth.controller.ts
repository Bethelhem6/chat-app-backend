// src/auth/auth.controller.ts
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('send-code')
  async sendVerificationCode(@Body() body: { phoneNumber: string }) {
    const { phoneNumber } = body;
    const code = await this.firebaseService.sendVerificationCode(phoneNumber);
    return {
      success: true,
      message: 'Verification code sent',
      // In production, don't return the actual code
      ...(process.env.NODE_ENV !== 'production' ? { code } : {}),
    };
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { phoneNumber: string; code: string }) {
    const { phoneNumber, code } = body;
    const isValid = await this.firebaseService.verifyPhoneNumber(
      phoneNumber,
      code,
    );

    if (!isValid) {
      return { success: false, message: 'Invalid verification code' };
    }

    // Check if user exists
    const userExists = await this.usersService.findByPhoneNumber(phoneNumber);

    if (userExists) {
      // User exists, generate login token
      const token = await this.authService.generateAuthToken(userExists);
      return {
        success: true,
        message: 'Verified successfully',
        token,
        user: userExists,
        isNewUser: false,
      };
    }

    // User doesn't exist, return temp token for registration
    const tempToken = await this.authService.generateTempToken(phoneNumber);
    return {
      success: true,
      message: 'Verified successfully. Please complete registration',
      tempToken,
      isNewUser: true,
    };
  }

  @Post('register')
  async register(
    @Body()
    body: {
      tempToken: string;
      firstName: string;
      lastName?: string;
      username?: string;
    },
  ) {
    const { tempToken, firstName, lastName, username } = body;

    // Verify temp token
    const phoneNumber = await this.authService.verifyTempToken(tempToken);

    // Create user
    const newUser = await this.usersService.create({
      phoneNumber,
      firstName,
      lastName,
      username,
    });

    // Generate auth token
    const token = await this.authService.generateAuthToken(newUser);

    return {
      success: true,
      message: 'Registration successful',
      token,
      user: newUser,
    };
  }
}
