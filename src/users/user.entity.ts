import { Contact } from 'src/contacts/contact.entity';
import { Message } from 'src/messages/message.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  firebase_uid: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Contact, (contact: Contact) => contact.user)
  contacts: Contact[];

  @OneToMany(() => Message, (message: Message) => message.sender)
  sent_messages: Message[];

  @OneToMany(() => Message, (message: Message) => message.receiver)
  received_messages: Message[];
}