import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { firebase_uid: firebaseUid },
    });
    return user ?? undefined;
  }

  async createUser(firebaseUid: string, phoneNumber: string): Promise<User> {
    const user = this.usersRepository.create({
      firebase_uid: firebaseUid,
      phone_number: phoneNumber,
    });
    return this.usersRepository.save(user);
  }

  async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(userId, updateData);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    return user;
  }

  async findByPhoneNumbers(phoneNumbers: string[]): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder()
      .where('phone_number IN (:...phoneNumbers)', { phoneNumbers })
      .getMany();
  }
}
