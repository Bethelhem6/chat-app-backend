import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private usersService: UsersService,
  ) {}

  async validateFirebaseToken(token: string): Promise<any> {
    try {
    //   const auth = this.firebaseService.getAuth();
    //   const decodedToken = await auth.verifyIdToken(token);
    //   return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async loginOrCreateUser(token: string): Promise<User> {
    const decodedToken = await this.validateFirebaseToken(token);
    const { uid, phone_number } = decodedToken;

    let user = await this.usersService.findOneByFirebaseUid(uid);
    if (!user) {
      user = await this.usersService.createUser(uid, phone_number);
    }

    return user;
  }
}
