import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {Post} from './post.model';
import {UserCredential} from './user-credential.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: false,
  })
  id?: number;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  gender?: boolean;

  @hasOne(() => UserCredential)
  userCredential: UserCredential;

  @hasMany(() => Post)
  posts: Post[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
