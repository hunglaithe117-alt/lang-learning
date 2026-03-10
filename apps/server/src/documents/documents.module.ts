import { Module } from '@nestjs/common';
import { DocumentsResolver } from './documents.resolver';
import { DocumentsService } from './documents.service';

@Module({
    providers: [DocumentsResolver, DocumentsService],
    exports: [DocumentsService],
})
export class DocumentsModule { }
