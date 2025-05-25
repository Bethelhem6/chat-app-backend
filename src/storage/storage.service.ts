import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  async uploadProfilePicture(file: Express.Multer.File): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileName = `profile-pictures/${uuidv4()}-${file.originalname}`;

    await bucket.file(fileName).save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    // Make the file publicly accessible
    await bucket.file(fileName).makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }
}
