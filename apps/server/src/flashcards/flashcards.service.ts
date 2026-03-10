import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FlashcardsService {
    constructor(private readonly prisma: PrismaService) { }

    findByUser(userId: string) {
        return this.prisma.flashcard.findMany({
            where: { userId },
            orderBy: { nextReview: 'asc' },
        });
    }

    findDueCards(userId: string) {
        return this.prisma.flashcard.findMany({
            where: {
                userId,
                nextReview: { lte: new Date() },
            },
            orderBy: { nextReview: 'asc' },
        });
    }

    create(data: {
        front: string;
        back: string;
        userId: string;
        documentId?: string;
        vocabularyId?: string;
    }) {
        return this.prisma.flashcard.create({ data });
    }

    createMany(
        cards: { front: string; back: string }[],
        userId: string,
        documentId?: string,
    ) {
        return this.prisma.flashcard.createMany({
            data: cards.map((card) => ({
                ...card,
                userId,
                documentId,
            })),
        });
    }

    /**
     * SM-2 algorithm for spaced repetition.
     * Updates ease factor, interval, and next review date.
     */
    async reviewCard(id: string, quality: number) {
        const card = await this.prisma.flashcard.findUnique({
            where: { id },
        });
        if (!card) return null;

        let { easeFactor, interval, repetitions } = card;

        if (quality >= 3) {
            if (repetitions === 0) interval = 1;
            else if (repetitions === 1) interval = 6;
            else interval = Math.round(interval * easeFactor);
            repetitions++;
        } else {
            repetitions = 0;
            interval = 1;
        }

        easeFactor = Math.max(
            1.3,
            easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
        );

        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        return this.prisma.flashcard.update({
            where: { id },
            data: { easeFactor, interval, repetitions, nextReview },
        });
    }

    async remove(id: string, userId: string) {
        await this.prisma.flashcard.deleteMany({
            where: { id, userId },
        });
        return true;
    }
}
