import { Module } from '@nestjs/common';
import { NotebooksResolver } from './notebooks.resolver';
import { NotebooksService } from './notebooks.service';

@Module({
    providers: [NotebooksResolver, NotebooksService],
    exports: [NotebooksService],
})
export class NotebooksModule { }
