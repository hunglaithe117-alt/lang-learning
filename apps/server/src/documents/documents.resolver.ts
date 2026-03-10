import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { Document } from './models/document.model';
import { DocumentsService } from './documents.service';

@Resolver(() => Document)
@UseGuards(GqlAuthGuard)
export class DocumentsResolver {
    constructor(
        private readonly documentsService: DocumentsService,
    ) { }

    @Query(() => [Document])
    async notebookDocuments(
        @Args('notebookId') notebookId: string,
    ) {
        return this.documentsService.findByNotebook(notebookId);
    }

    @Query(() => Document, { nullable: true })
    async document(@Args('id') id: string) {
        return this.documentsService.findOne(id);
    }

    @Mutation(() => Boolean)
    async deleteDocument(@Args('id') id: string) {
        return this.documentsService.remove(id);
    }
}
