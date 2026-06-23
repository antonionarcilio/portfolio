import 'server-only';

import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache, registerApolloClient } from '@apollo/client-integration-nextjs';

import { env } from '@/env';
import { PORTFOLIO_CACHE_TAG } from '@/shared/data/strapi-client';

const fetchOptions =
  process.env.NODE_ENV === 'development'
    ? { cache: 'no-store' as const }
    : { next: { tags: [PORTFOLIO_CACHE_TAG], revalidate: 3600 } };

export const { getClient, query, PreloadQuery } = registerApolloClient(
  () =>
    new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: `${env.STRAPI_API_URL}/graphql`,
        headers: { Authorization: `Bearer ${env.STRAPI_API_TOKEN}` },
        fetchOptions,
      }),
    }),
);
