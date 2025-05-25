import { Controller, Post, Get, Body } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { UsersService } from '../users/users.service';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sync')
  async syncContacts(
    @Body('phoneNumbers') phoneNumbers: string[],
    @Body('userId') userId: number,
  ) {
    const currentUser = await this.usersService.findByFirebaseUid(userId.toString());
    if (!currentUser) throw new Error('User not found');

    const registeredContacts = await this.usersService.findByPhoneNumbers(
      phoneNumbers.filter(num => num !== currentUser.phone_number)
    );

    const contacts = await Promise.all(
      registeredContacts.map((contactUser) =>
        this.contactsService.createContact(currentUser.id, contactUser.id),
      ),
    );

    return { contacts };
  }

  @Get()
  async getContacts(@Body('userId') userId: number) {
    return this.contactsService.getUserContacts(userId);
  }
}