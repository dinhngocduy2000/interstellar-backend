import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("conversations")
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true, default: new Date().toISOString() })
  created_at: string;

  @Column({ nullable: true, default: new Date().toISOString() })
  updated_at: string;

  @Column({ nullable: true, default: null })
  deleted_at?: string;

  @Column({ default: false })
  is_pinned: boolean;

  @Column()
  first_message: string;

  @Column({ default: false })
  is_new: boolean;

  @Column()
  model: string;

  @Column()
  user_id: string;

  @OneToMany(() => Message, (message) => message.conversation_id)
  messages: Message[];
}

@Entity("message")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  author: "user" | "bot";

  @Column({ nullable: true, default: new Date().toISOString() })
  created_at: string;

  @Column({ nullable: true, default: new Date().toISOString() })
  updated_at: string;

  @Column({ default: false })
  is_upvote: boolean;

  @Column({
    default: false,
  })
  is_downvote: boolean;

  @Column()
  content: string;

  @Column()
  conversation_id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation?: Conversation;
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ unique: true, nullable: false })
  username!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: false })
  role!: string;

  @Column({ default: true })
  isActive!: boolean;

  /** OAuth provider name (e.g., 'google', 'microsoft') */
  @Column({ nullable: true })
  oauthProvider?: string;

  /** OAuth provider unique ID */
  @Column({ nullable: true })
  oauthProviderId?: string;

  /** Email verification status */
  @Column({ default: false })
  emailVerified?: boolean;

  @CreateDateColumn({ nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt!: Date;
}
