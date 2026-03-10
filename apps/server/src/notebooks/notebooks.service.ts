import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateNotebookInput } from './dto/create-notebook.input';
import { UpdateNotebookInput } from './dto/update-notebook.input';

@Injectable()
export class NotebooksService {
    constructor(private readonly prisma: PrismaService) { }

    findAllByUser(userId: string) {
        return this.prisma.notebook.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: { documents: true },
        });
    }

    findOne(id: string, userId: string) {
        return this.prisma.notebook.findFirst({
            where: { id, userId },
            include: { documents: true },
        });
    }

    create(userId: string, data: CreateNotebookInput) {
        return this.prisma.notebook.create({
            data: { ...data, userId },
        });
    }

    update(id: string, userId: string, data: UpdateNotebookInput) {
        return this.prisma.notebook.updateMany({
            where: { id, userId },
            data,
        });
    }

    async remove(id: string, userId: string) {
        await this.prisma.notebook.deleteMany({
            where: { id, userId },
        });
        return true;
    }
}
