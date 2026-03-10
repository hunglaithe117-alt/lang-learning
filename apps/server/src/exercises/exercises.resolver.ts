import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UserEntity } from '../common/decorators/user.decorator';
import { User } from '../users/models/user.model';
import { Exercise } from './models/exercise.model';
import { ExercisesService } from './exercises.service';

@Resolver(() => Exercise)
@UseGuards(GqlAuthGuard)
export class ExercisesResolver {
    constructor(
        private readonly exercisesService: ExercisesService,
    ) { }

    @Query(() => [Exercise])
    async myExercises(@UserEntity() user: User) {
        return this.exercisesService.findByUser(user.id);
    }

    @Query(() => [Exercise])
    async documentExercises(
        @UserEntity() user: User,
        @Args('documentId') documentId: string,
    ) {
        return this.exercisesService.findByDocument(
            documentId,
            user.id,
        );
    }

    @Mutation(() => Boolean)
    async submitAnswer(
        @UserEntity() user: User,
        @Args('exerciseId') exerciseId: string,
        @Args('answer') answer: string,
    ) {
        const attempt = await this.exercisesService.submitAttempt(
            exerciseId,
            user.id,
            answer,
        );
        return attempt?.isCorrect ?? false;
    }
}
