import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { Difficulty, ExerciseType } from '../../common/enums';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType()
export class Exercise extends BaseModel {
    @Field(() => ExerciseType)
    type: ExerciseType;

    @Field()
    question: string;

    @Field(() => GraphQLJSON, { nullable: true })
    options?: Record<string, unknown>;

    @Field()
    answer: string;

    @Field({ nullable: true })
    explanation?: string;

    @Field(() => Difficulty)
    difficulty: Difficulty;

    @Field({ nullable: true })
    documentId?: string;

    @Field()
    userId: string;
}
