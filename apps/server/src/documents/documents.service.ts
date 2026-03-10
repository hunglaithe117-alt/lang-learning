import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Language } from '../common/enums';

@Injectable()
export class DocumentsService {
    constructor(private readonly prisma: PrismaService) { }

    findByNotebook(notebookId: string) {
        return this.prisma.document.findMany({
            where: { notebookId },
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: string) {
        return this.prisma.document.findUnique({
            where: { id },
        });
    }

    create(data: {
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        language: Language;
        notebookId: string;
    }) {
        return this.prisma.document.create({ data });
    }

    markProcessed(id: string, chunksCount: number) {
        return this.prisma.document.update({
            where: { id },
            data: { isProcessed: true, chunksCount },
        });
    }

    async remove(id: string) {
        await this.prisma.document.delete({ where: { id } });
        return true;
    }
}
