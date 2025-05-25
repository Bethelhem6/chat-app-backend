import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readonly app: admin.app.App;

  constructor(private configService: ConfigService) {
    // this.app = admin.initializeApp({
    //   credential: admin.credential.cert({
    //     projectId: configService.get('FIREBASE_PROJECT_ID'),
    //     privateKey: configService
    //       .get('FIREBASE_PRIVATE_KEY')
    //       .replace(/\\n/g, '\n'),
    //     clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
    //   }),
    // });
  }

  getAuth(): admin.auth.Auth {
    return this.app.auth();
  }
}
