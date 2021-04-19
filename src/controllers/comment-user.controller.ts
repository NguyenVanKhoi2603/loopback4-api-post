import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, response
} from '@loopback/rest';
import {
  Comment,
  User
} from '../models';
import {CommentRepository} from '../repositories';

export class CommentUserController {
  constructor(
    @repository(CommentRepository)
    public commentRepository: CommentRepository,
  ) { }

  @get('/comments/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Comment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Comment.prototype.id,
  ): Promise<User> {
    return this.commentRepository.user(id);
  }



  @get('/comments/users')
  @response(200, {
    description: 'Array of Comment model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Comment, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Comment) filter?: Filter<Comment>,
  ): Promise<Comment[]> {
    // const myFilter = {
    //   include: [{'users'}]
    // };
    return this.commentRepository.find(
      {
        include: [{relation: 'user'}]
      }
    );
  }

}
