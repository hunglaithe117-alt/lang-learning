import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Difficulty, ExerciseType } from '../common/enums';

@Injectable()
export class ExercisesService {
    constructor(private readonly prisma: PrismaService) { }

    findByUser(userId: string) {
        return this.prisma.exercise.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    findByDocument(documentId: string, userId: string) {
        return this.prisma.exercise.findMany({
            where: { documentId, userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    create(data: {
        type: ExerciseType;
        question: string;
        answer: string;
        options?: Record<string, unknown>;
        explanation?: string;
        difficulty?: Difficulty;
        documentId?: string;
        userId: string;
    }) {
        return this.prisma.exercise.create({ data });
    }

    createMany(
        exercises: {
            type: ExerciseType;
            question: string;
            answer: string;
            options?: Record<string, unknown>;
            explanation?: string;
            difficulty?: Difficulty;
        }[],
        userId: string,
        documentId?: string,
    ) {
        return this.prisma.exercise.createMany({
            data: exercises.map((ex) => ({
                ...ex,
                userId,
                documentId,
            })),
        });
    }

    async submitAttempt(
        exerciseId: string,
        userId: string,
        answer: string,
    ) {
        const exercise = await this.prisma.exercise.findUnique({
            where: { id: exerciseId },
        });
        if (!exercise) return null;

        const isCorrect =
            answer.toLowerCase().trim() ===
            exercise.answer.toLowerCase().trim();

        return this.prisma.exerciseAttempt.create({
            data: { exerciseId, userId, answer, isCorrect },
        });
    }
}
