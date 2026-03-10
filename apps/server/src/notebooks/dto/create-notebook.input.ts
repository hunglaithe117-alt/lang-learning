import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Language } from '../../common/enums';

@InputType()
export class CreateNotebookInput {
    @Field()
    @IsNotEmpty()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Language, { defaultValue: Language.ENGLISH })
    language: Language;
}
