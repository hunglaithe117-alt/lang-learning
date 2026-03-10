/** User roles matching the Prisma schema enum */
export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

/** Base entity fields present on all models */
export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

/** User entity shape */
export interface UserType extends BaseEntity {
    email: string;
    firstname?: string | null;
    lastname?: string | null;
    role: UserRole;
}

/** Pagination info for relay-style connections */
export interface PageInfoType {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
}
