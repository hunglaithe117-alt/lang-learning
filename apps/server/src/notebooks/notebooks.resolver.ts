import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { Notebook } from './models/notebook.model';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookInput } from './dto/create-notebook.input';
import { UpdateNotebookInput } from './dto/update-notebook.input';

@Resolver(() => Notebook)
@UseGuards(GqlAuthGuard)
export class NotebooksResolver {
    constructor(private readonly notebooksService: NotebooksService) { }

    @Query(() => [Notebook])
    async myNotebooks(@UserEntity() user: User) {
        return this.notebooksService.findAllByUser(user.id);
    }

    @Query(() => Notebook, { nullable: true })
    async notebook(
        @UserEntity() user: User,
        @Args('id') id: string,
    ) {
        return this.notebooksService.findOne(id, user.id);
    }

    @Mutation(() => Notebook)
    async createNotebook(
        @UserEntity() user: User,
        @Args('data') data: CreateNotebookInput,
    ) {
        return this.notebooksService.create(user.id, data);
    }

    @Mutation(() => Boolean)
    async updateNotebook(
        @UserEntity() user: User,
        @Args('id') id: string,
        @Args('data') data: UpdateNotebookInput,
    ) {
        await this.notebooksService.update(id, user.id, data);
        return true;
    }

    @Mutation(() => Boolean)
    async deleteNotebook(
        @UserEntity() user: User,
        @Args('id') id: string,
    ) {
        return this.notebooksService.remove(id, user.id);
    }
}
