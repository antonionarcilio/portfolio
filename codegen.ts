import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  schema: {
    [`${process.env.STRAPI_API_URL}/graphql`]: {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    },
  },
  documents: ['src/**/*.graphql'],
  generates: {
    'src/gql/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
