import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]), // This makes ContactRepository available
    UsersModule, // Required for UsersService
  ],

  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
