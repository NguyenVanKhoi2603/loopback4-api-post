import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Post extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  content?: string;

  @property({
    type: 'date',
  })
  timestamp?: string;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
}

export type PostWithRelations = Post & PostRelations;
