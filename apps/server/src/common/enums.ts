import { registerEnumType } from '@nestjs/graphql';

export enum Language {
    ENGLISH = 'ENGLISH',
    CHINESE = 'CHINESE',
}

export enum Difficulty {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

export enum ExerciseType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    FILL_IN_BLANK = 'FILL_IN_BLANK',
    MATCHING = 'MATCHING',
    TRANSLATION = 'TRANSLATION',
    READING_COMPREHENSION = 'READING_COMPREHENSION',
    SENTENCE_ORDERING = 'SENTENCE_ORDERING',
}

registerEnumType(Language, {
    name: 'Language',
    description: 'Supported learning languages',
});

registerEnumType(Difficulty, {
    name: 'Difficulty',
    description: 'Content difficulty level',
});

registerEnumType(ExerciseType, {
    name: 'ExerciseType',
    description: 'Type of learning exercise',
});
