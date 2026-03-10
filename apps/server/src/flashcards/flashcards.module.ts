import { Module } from '@nestjs/common';
import { FlashcardsResolver } from './flashcards.resolver';
import { FlashcardsService } from './flashcards.service';

@Module({
    providers: [FlashcardsResolver, FlashcardsService],
    exports: [FlashcardsService],
})
export class FlashcardsModule { }
