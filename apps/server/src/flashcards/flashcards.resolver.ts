import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { Flashcard } from './models/flashcard.model';
import { FlashcardsService } from './flashcards.service';

@Resolver(() => Flashcard)
@UseGuards(GqlAuthGuard)
export class FlashcardsResolver {
    constructor(
        private readonly flashcardsService: FlashcardsService,
    ) { }

    @Query(() => [Flashcard])
    async myFlashcards(@UserEntity() user: User) {
        return this.flashcardsService.findByUser(user.id);
    }

    @Query(() => [Flashcard])
    async dueFlashcards(@UserEntity() user: User) {
        return this.flashcardsService.findDueCards(user.id);
    }

    @Mutation(() => Flashcard, { nullable: true })
    async reviewFlashcard(
        @Args('id') id: string,
        @Args('quality', { type: () => Int }) quality: number,
    ) {
        return this.flashcardsService.reviewCard(id, quality);
    }

    @Mutation(() => Boolean)
    async deleteFlashcard(
        @UserEntity() user: User,
        @Args('id') id: string,
    ) {
        return this.flashcardsService.remove(id, user.id);
    }
}
