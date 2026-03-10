import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:3000/graphql',
    documents: ['src/**/*.{ts,tsx}'],
    ignoreNoDocuments: true,
    generates: {
        './src/graphql/generated/': {
            preset: 'client',
            config: {
                documentMode: 'string',
            },
        },
    },
};

export default config;
