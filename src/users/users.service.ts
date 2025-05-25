import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { phone_number: phoneNumber },
    });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { firebase_uid: firebaseUid },
    });
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const existing = await this.usersRepository.findOne({
      where: { username },
    });
    return !existing;
  }

  async createUser(userData: {
    firebase_uid: string;
    phone_number: string;
    username: string;
    profile_picture_url?: string;
  }): Promise<User> {
    if (!(await this.isUsernameAvailable(userData.username))) {
      throw new ConflictException('Username already taken');
    }

    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByPhoneNumbers(phoneNumbers: string[]): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder()
      .where('phone_number IN (:...phoneNumbers)', { phoneNumbers })
      .getMany();
  }
}
