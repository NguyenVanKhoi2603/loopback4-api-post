import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Post, PostRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Post.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Post, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
