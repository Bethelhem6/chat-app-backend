import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { StorageService } from '../storage/storage.service';
// import { File as MulterFile } from 'multer'; // Removed: Multer does not export 'File'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Post('complete-profile')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Only image files allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async completeProfile(
    @Body('firebaseUid') firebaseUid: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('username') username: string,
    @UploadedFile() profilePicture?: Express.Multer.File, // Use Express.Multer.File type
  ) {
    const profilePicUrl = profilePicture
      ? await this.storageService.uploadProfilePicture(profilePicture)
      : null;

    return this.usersService.createUser({
      firebase_uid: firebaseUid,
      phone_number: phoneNumber,
      username,
      profile_picture_url: profilePicUrl ?? '',
    });
  }

  @Post('check-username')
  async checkUsername(@Body('username') username: string) {
    const available = await this.usersService.isUsernameAvailable(username);
    return { available };
  }
}
