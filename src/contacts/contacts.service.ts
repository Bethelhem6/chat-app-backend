import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
    private usersService: UsersService,
  ) {}

  async syncContacts(
    userId: number,
    phoneNumbers: string[],
  ): Promise<Contact[]> {
    // Find registered users from the phone numbers
    const registeredUsers =
      await this.usersService.findByPhoneNumbers(phoneNumbers);

    // Create contact relationships
    const contacts = await Promise.all(
      registeredUsers.map(async (contactUser) => {
        // Check if contact already exists
        const existingContact = await this.contactsRepository.findOne({
          where: {
            user: { id: userId },
            contact_user: { id: contactUser.id },
          },
        });

        if (!existingContact) {
          const newContact = this.contactsRepository.create({
            user: { id: userId },
            contact_user: { id: contactUser.id },
          });
          return this.contactsRepository.save(newContact);
        }
        return existingContact;
      }),
    );

    return contacts.filter(Boolean);
  }

  async getUserContacts(userId: number): Promise<Contact[]> {
    return this.contactsRepository.find({
      where: { user: { id: userId } },
      relations: ['contact_user'],
    });
  }
}
