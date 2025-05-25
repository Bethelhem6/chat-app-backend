import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async createMessage(
    senderId: number,
    receiverId: number,
    content: string,
  ): Promise<Message> {
    const message = this.messagesRepository.create({
      senderId,
      receiverId,
      content,
    });
    return this.messagesRepository.save(message);
  }

  async getMessageHistory(
    userId: number,
    contactId: number,
  ): Promise<Message[]> {
    return this.messagesRepository
      .createQueryBuilder('message')
      .where(
        '(message.sender_id = :userId AND message.receiver_id = :contactId) OR (message.sender_id = :contactId AND message.receiver_id = :userId)',
        { userId, contactId },
      )
      .orderBy('message.created_at', 'ASC')
      .getMany();
  }

  async markMessagesAsRead(userId: number, senderId: number): Promise<void> {
    await this.messagesRepository
      .createQueryBuilder()
      .update(Message)
      .set({ is_read: true })
      .where(
        'receiver_id = :userId AND sender_id = :senderId AND is_read = false',
        { userId, senderId },
      )
      .execute();
  }
}
