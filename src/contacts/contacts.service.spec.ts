import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';


@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async createContact(userId: number, contactUserId: number): Promise<Contact> {
    const existing = await this.contactsRepository.findOne({
      where: { userId, contactUserId },
    });

    if (existing) return existing;

    const contact = this.contactsRepository.create({
      userId,
      contactUserId,
    });

    return this.contactsRepository.save(contact);
  }

  async getUserContacts(userId: number): Promise<Contact[]> {
    return this.contactsRepository.find({
      where: { userId },
      relations: ['contact_user'],
    });
  }
}
