/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  'query I18NLocales {\n  i18NLocales {\n    name\n    code\n  }\n}': typeof types.I18NLocalesDocument;
  'query Portfolio($locale: I18NLocaleCode) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    location\n    experience_months\n    working_days_per_year\n    contact {\n      id\n      label\n      url\n    }\n    skills {\n      id\n      name\n      technologies {\n        name\n      }\n    }\n    projects {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      technologies {\n        name\n      }\n    }\n    services {\n      id\n      title\n      description\n    }\n    experience {\n      id\n      company\n      company_url\n      role\n      start_date\n      end_date\n      details\n      technologies {\n        name\n      }\n    }\n    education {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements {\n      id\n      badge {\n        name\n        alternativeText\n        caption\n        width\n        height\n        url\n        formats\n      }\n      title\n      year\n      desc\n    }\n  }\n}': typeof types.PortfolioDocument;
};
const documents: Documents = {
  'query I18NLocales {\n  i18NLocales {\n    name\n    code\n  }\n}': types.I18NLocalesDocument,
  'query Portfolio($locale: I18NLocaleCode) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    location\n    experience_months\n    working_days_per_year\n    contact {\n      id\n      label\n      url\n    }\n    skills {\n      id\n      name\n      technologies {\n        name\n      }\n    }\n    projects {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      technologies {\n        name\n      }\n    }\n    services {\n      id\n      title\n      description\n    }\n    experience {\n      id\n      company\n      company_url\n      role\n      start_date\n      end_date\n      details\n      technologies {\n        name\n      }\n    }\n    education {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements {\n      id\n      badge {\n        name\n        alternativeText\n        caption\n        width\n        height\n        url\n        formats\n      }\n      title\n      year\n      desc\n    }\n  }\n}':
    types.PortfolioDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'query I18NLocales {\n  i18NLocales {\n    name\n    code\n  }\n}',
): (typeof documents)['query I18NLocales {\n  i18NLocales {\n    name\n    code\n  }\n}'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'query Portfolio($locale: I18NLocaleCode) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    location\n    experience_months\n    working_days_per_year\n    contact {\n      id\n      label\n      url\n    }\n    skills {\n      id\n      name\n      technologies {\n        name\n      }\n    }\n    projects {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      technologies {\n        name\n      }\n    }\n    services {\n      id\n      title\n      description\n    }\n    experience {\n      id\n      company\n      company_url\n      role\n      start_date\n      end_date\n      details\n      technologies {\n        name\n      }\n    }\n    education {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements {\n      id\n      badge {\n        name\n        alternativeText\n        caption\n        width\n        height\n        url\n        formats\n      }\n      title\n      year\n      desc\n    }\n  }\n}',
): (typeof documents)['query Portfolio($locale: I18NLocaleCode) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    location\n    experience_months\n    working_days_per_year\n    contact {\n      id\n      label\n      url\n    }\n    skills {\n      id\n      name\n      technologies {\n        name\n      }\n    }\n    projects {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      technologies {\n        name\n      }\n    }\n    services {\n      id\n      title\n      description\n    }\n    experience {\n      id\n      company\n      company_url\n      role\n      start_date\n      end_date\n      details\n      technologies {\n        name\n      }\n    }\n    education {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements {\n      id\n      badge {\n        name\n        alternativeText\n        caption\n        width\n        height\n        url\n        formats\n      }\n      title\n      year\n      desc\n    }\n  }\n}'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
