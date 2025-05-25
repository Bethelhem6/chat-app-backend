import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]), // This provides MessageRepository
    UsersModule, // Import if your service uses UsersService
  ],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
