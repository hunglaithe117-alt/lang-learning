import { Field, ObjectType, Float, Int } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';

@ObjectType()
export class Flashcard extends BaseModel {
    @Field()
    front: string;

    @Field()
    back: string;

    @Field(() => Float)
    easeFactor: number;

    @Field(() => Int)
    interval: number;

    @Field(() => Int)
    repetitions: number;

    @Field()
    nextReview: Date;

    @Field({ nullable: true })
    vocabularyId?: string;

    @Field({ nullable: true })
    documentId?: string;

    @Field()
    userId: string;
}
