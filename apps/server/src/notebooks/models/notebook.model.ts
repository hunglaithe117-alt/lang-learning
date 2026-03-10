import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { Language } from '../../common/enums';

@ObjectType()
export class Notebook extends BaseModel {
    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Language)
    language: Language;

    @Field()
    userId: string;
}
