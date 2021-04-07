import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Post} from './post.model';

@model()
export class Comment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

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

  @belongsTo(() => Post)
  postId: number;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;
