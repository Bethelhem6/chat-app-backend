import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private usersService: UsersService,
  ) {}

  async verifyFirebaseToken(
    token: string,
  ): Promise<{ uid: string; phone_number: string }> {
    try {
      const decoded = await this.firebaseService.getAuth().verifyIdToken(token);
      return {
        uid: decoded.uid,
        phone_number: decoded.phone_number ?? '',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
