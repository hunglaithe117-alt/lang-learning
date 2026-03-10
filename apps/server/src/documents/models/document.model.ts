import { Field, ObjectType, Int } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.model';
import { Language } from '../../common/enums';

@ObjectType()
export class Document extends BaseModel {
    @Field()
    filename: string;

    @Field()
    originalName: string;

    @Field()
    mimeType: string;

    @Field(() => Int)
    size: number;

    @Field({ nullable: true })
    content?: string;

    @Field(() => Language)
    language: Language;

    @Field()
    isProcessed: boolean;

    @Field(() => Int)
    chunksCount: number;

    @Field()
    notebookId: string;
}
