import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  firebase_uid: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
