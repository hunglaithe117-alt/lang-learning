import { Field, InputType } from '@nestjs/graphql';
import { Language } from '../../common/enums';

@InputType()
export class UpdateNotebookInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => Language, { nullable: true })
    language?: Language;
}
