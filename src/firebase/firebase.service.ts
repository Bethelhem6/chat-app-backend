// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private auth: admin.auth.Auth;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    this.auth = admin.auth();
  }

  async sendVerificationCode(phoneNumber: string): Promise<string> {
    try {
      // In production, Firebase sends SMS automatically
      // For development, we'll mock this
      if (process.env.NODE_ENV === 'production') {
        await this.auth.createUser({ phoneNumber });
      }
      return '123456'; // Mock code for development
    } catch (error) {
      throw new Error(`Failed to send verification code: ${error.message}`);
    }
  }
  

  async verifyPhoneNumber(phoneNumber: string, code: string): Promise<boolean> {
    if (process.env.NODE_ENV === 'production') {
      try {
        await this.auth.verifyIdToken(code); // Actual implementation would differ
        return true;
      } catch (error) {
        return false;
      }
    }
    return code === '123456'; // Mock verification for development
  }
}
