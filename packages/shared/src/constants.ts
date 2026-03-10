/** Application-wide constants */

export const APP_NAME = 'Lang Learning';

/** API Endpoints */
export const API_ENDPOINTS = {
    GRAPHQL: '/graphql',
    HEALTH: '/health',
} as const;

/** Default pagination */
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
} as const;

/** Supported languages */
export const SUPPORTED_LANGUAGES = {
    ENGLISH: 'en',
    CHINESE: 'zh',
    VIETNAMESE: 'vi',
} as const;

export type SupportedLanguage =
    (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];
