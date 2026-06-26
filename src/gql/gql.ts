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
  'query Contact($documentId: ID!) {\n  contact(documentId: $documentId) {\n    documentId\n    url\n    label\n  }\n}': typeof types.ContactDocument;
  'query Contacts($sort: [String]) {\n  contacts(sort: $sort) {\n    documentId\n    label\n    url\n  }\n}': typeof types.ContactsDocument;
  'query I18NLocales {\n  i18NLocales {\n    name\n    code\n  }\n}': typeof types.I18NLocalesDocument;
  'query Portfolio($locale: I18NLocaleCode, $educationSort: [String], $achievementsSort: [String], $contactSort: [String], $experienceSort: [String], $projectsSort: [String], $servicesSort: [String], $skillsSort: [String], $experienceTechSort: [String], $skillsTechSort: [String], $projectsTechSort: [String], $experienceStacksSort: [String]) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    seniority\n    company\n    location\n    documentId\n    highlight_text\n    experience_months\n    skills(sort: $skillsSort) {\n      id\n      name\n      technologies(sort: $skillsTechSort) {\n        name\n        proficiency_level\n      }\n    }\n    projects(sort: $projectsSort) {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      stack {\n        project_name\n        technologies(sort: $projectsTechSort) {\n          name\n          proficiency_level\n        }\n      }\n      preview {\n        alternativeText\n        formats\n        height\n        name\n        url\n        width\n        documentId\n      }\n    }\n    services(sort: $servicesSort) {\n      id\n      title\n      description\n      contact {\n        url\n        label\n        documentId\n      }\n    }\n    experience(sort: $experienceSort) {\n      id\n      company\n      company_url\n      expertise_area\n      start_date\n      end_date\n      details\n      stacks(sort: $experienceStacksSort) {\n        project_name\n        technologies(sort: $experienceTechSort) {\n          proficiency_level\n          name\n        }\n        documentId\n      }\n    }\n    education(sort: $educationSort) {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements(sort: $achievementsSort) {\n      id\n      badge {\n        documentId\n        name\n        alternativeText\n        width\n        height\n        formats\n        mime\n        url\n      }\n      title\n      year\n      desc\n    }\n    contact(sort: $contactSort) {\n      label\n      url\n      documentId\n      name\n      tooltip\n    }\n  }\n}': typeof types.PortfolioDocument;
  'query Stack($documentId: ID!, $sort: [String]) {\n  stack(documentId: $documentId) {\n    documentId\n    project_name\n    technologies(sort: $sort) {\n      name\n      proficiency_level\n    }\n  }\n}': typeof types.StackDocument;
  'query Stacks($sort: [String]) {\n  stacks(sort: $sort) {\n    documentId\n    project_name\n    technologies {\n      name\n      proficiency_level\n    }\n  }\n}': typeof types.StacksDocument;
  'query PortfolioXpStats($locale: String) {\n  portfolioXpStats(locale: $locale) {\n    workingDaysPerYear\n    currentLevel\n    currentXp\n    nextLevelXp\n    fill\n    label\n  }\n}': typeof types.PortfolioXpStatsDocument;
};
const documents: Documents = {
  'query Contact($documentId: ID!) {\n  contact(documentId: $documentId) {\n    documentId\n    url\n    label\n  }\n}':
    types.ContactDocument,
  'query Contacts($sort: [String]) {\n  contacts(sort: $sort) {\n    documentId\n    label\n    url\n  }\n}':
    types.ContactsDocument,
  'query I18NLocales {\n  i18NLocales {\n    name\n    code\n  }\n}': types.I18NLocalesDocument,
  'query Portfolio($locale: I18NLocaleCode, $educationSort: [String], $achievementsSort: [String], $contactSort: [String], $experienceSort: [String], $projectsSort: [String], $servicesSort: [String], $skillsSort: [String], $experienceTechSort: [String], $skillsTechSort: [String], $projectsTechSort: [String], $experienceStacksSort: [String]) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    seniority\n    company\n    location\n    documentId\n    highlight_text\n    experience_months\n    skills(sort: $skillsSort) {\n      id\n      name\n      technologies(sort: $skillsTechSort) {\n        name\n        proficiency_level\n      }\n    }\n    projects(sort: $projectsSort) {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      stack {\n        project_name\n        technologies(sort: $projectsTechSort) {\n          name\n          proficiency_level\n        }\n      }\n      preview {\n        alternativeText\n        formats\n        height\n        name\n        url\n        width\n        documentId\n      }\n    }\n    services(sort: $servicesSort) {\n      id\n      title\n      description\n      contact {\n        url\n        label\n        documentId\n      }\n    }\n    experience(sort: $experienceSort) {\n      id\n      company\n      company_url\n      expertise_area\n      start_date\n      end_date\n      details\n      stacks(sort: $experienceStacksSort) {\n        project_name\n        technologies(sort: $experienceTechSort) {\n          proficiency_level\n          name\n        }\n        documentId\n      }\n    }\n    education(sort: $educationSort) {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements(sort: $achievementsSort) {\n      id\n      badge {\n        documentId\n        name\n        alternativeText\n        width\n        height\n        formats\n        mime\n        url\n      }\n      title\n      year\n      desc\n    }\n    contact(sort: $contactSort) {\n      label\n      url\n      documentId\n      name\n      tooltip\n    }\n  }\n}':
    types.PortfolioDocument,
  'query Stack($documentId: ID!, $sort: [String]) {\n  stack(documentId: $documentId) {\n    documentId\n    project_name\n    technologies(sort: $sort) {\n      name\n      proficiency_level\n    }\n  }\n}':
    types.StackDocument,
  'query Stacks($sort: [String]) {\n  stacks(sort: $sort) {\n    documentId\n    project_name\n    technologies {\n      name\n      proficiency_level\n    }\n  }\n}':
    types.StacksDocument,
  'query PortfolioXpStats($locale: String) {\n  portfolioXpStats(locale: $locale) {\n    workingDaysPerYear\n    currentLevel\n    currentXp\n    nextLevelXp\n    fill\n    label\n  }\n}':
    types.PortfolioXpStatsDocument,
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
  source: 'query Contact($documentId: ID!) {\n  contact(documentId: $documentId) {\n    documentId\n    url\n    label\n  }\n}',
): (typeof documents)['query Contact($documentId: ID!) {\n  contact(documentId: $documentId) {\n    documentId\n    url\n    label\n  }\n}'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'query Contacts($sort: [String]) {\n  contacts(sort: $sort) {\n    documentId\n    label\n    url\n  }\n}',
): (typeof documents)['query Contacts($sort: [String]) {\n  contacts(sort: $sort) {\n    documentId\n    label\n    url\n  }\n}'];
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
  source: 'query Portfolio($locale: I18NLocaleCode, $educationSort: [String], $achievementsSort: [String], $contactSort: [String], $experienceSort: [String], $projectsSort: [String], $servicesSort: [String], $skillsSort: [String], $experienceTechSort: [String], $skillsTechSort: [String], $projectsTechSort: [String], $experienceStacksSort: [String]) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    seniority\n    company\n    location\n    documentId\n    highlight_text\n    experience_months\n    skills(sort: $skillsSort) {\n      id\n      name\n      technologies(sort: $skillsTechSort) {\n        name\n        proficiency_level\n      }\n    }\n    projects(sort: $projectsSort) {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      stack {\n        project_name\n        technologies(sort: $projectsTechSort) {\n          name\n          proficiency_level\n        }\n      }\n      preview {\n        alternativeText\n        formats\n        height\n        name\n        url\n        width\n        documentId\n      }\n    }\n    services(sort: $servicesSort) {\n      id\n      title\n      description\n      contact {\n        url\n        label\n        documentId\n      }\n    }\n    experience(sort: $experienceSort) {\n      id\n      company\n      company_url\n      expertise_area\n      start_date\n      end_date\n      details\n      stacks(sort: $experienceStacksSort) {\n        project_name\n        technologies(sort: $experienceTechSort) {\n          proficiency_level\n          name\n        }\n        documentId\n      }\n    }\n    education(sort: $educationSort) {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements(sort: $achievementsSort) {\n      id\n      badge {\n        documentId\n        name\n        alternativeText\n        width\n        height\n        formats\n        mime\n        url\n      }\n      title\n      year\n      desc\n    }\n    contact(sort: $contactSort) {\n      label\n      url\n      documentId\n      name\n      tooltip\n    }\n  }\n}',
): (typeof documents)['query Portfolio($locale: I18NLocaleCode, $educationSort: [String], $achievementsSort: [String], $contactSort: [String], $experienceSort: [String], $projectsSort: [String], $servicesSort: [String], $skillsSort: [String], $experienceTechSort: [String], $skillsTechSort: [String], $projectsTechSort: [String], $experienceStacksSort: [String]) {\n  portfolio(locale: $locale) {\n    name\n    last_name\n    expertise_area\n    seniority\n    company\n    location\n    documentId\n    highlight_text\n    experience_months\n    skills(sort: $skillsSort) {\n      id\n      name\n      technologies(sort: $skillsTechSort) {\n        name\n        proficiency_level\n      }\n    }\n    projects(sort: $projectsSort) {\n      id\n      company\n      company_url\n      project_name\n      desc\n      start_date\n      end_date\n      stack {\n        project_name\n        technologies(sort: $projectsTechSort) {\n          name\n          proficiency_level\n        }\n      }\n      preview {\n        alternativeText\n        formats\n        height\n        name\n        url\n        width\n        documentId\n      }\n    }\n    services(sort: $servicesSort) {\n      id\n      title\n      description\n      contact {\n        url\n        label\n        documentId\n      }\n    }\n    experience(sort: $experienceSort) {\n      id\n      company\n      company_url\n      expertise_area\n      start_date\n      end_date\n      details\n      stacks(sort: $experienceStacksSort) {\n        project_name\n        technologies(sort: $experienceTechSort) {\n          proficiency_level\n          name\n        }\n        documentId\n      }\n    }\n    education(sort: $educationSort) {\n      id\n      title\n      institution\n      description\n      year\n      degree_type\n    }\n    achievements(sort: $achievementsSort) {\n      id\n      badge {\n        documentId\n        name\n        alternativeText\n        width\n        height\n        formats\n        mime\n        url\n      }\n      title\n      year\n      desc\n    }\n    contact(sort: $contactSort) {\n      label\n      url\n      documentId\n      name\n      tooltip\n    }\n  }\n}'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'query Stack($documentId: ID!, $sort: [String]) {\n  stack(documentId: $documentId) {\n    documentId\n    project_name\n    technologies(sort: $sort) {\n      name\n      proficiency_level\n    }\n  }\n}',
): (typeof documents)['query Stack($documentId: ID!, $sort: [String]) {\n  stack(documentId: $documentId) {\n    documentId\n    project_name\n    technologies(sort: $sort) {\n      name\n      proficiency_level\n    }\n  }\n}'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'query Stacks($sort: [String]) {\n  stacks(sort: $sort) {\n    documentId\n    project_name\n    technologies {\n      name\n      proficiency_level\n    }\n  }\n}',
): (typeof documents)['query Stacks($sort: [String]) {\n  stacks(sort: $sort) {\n    documentId\n    project_name\n    technologies {\n      name\n      proficiency_level\n    }\n  }\n}'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: 'query PortfolioXpStats($locale: String) {\n  portfolioXpStats(locale: $locale) {\n    workingDaysPerYear\n    currentLevel\n    currentXp\n    nextLevelXp\n    fill\n    label\n  }\n}',
): (typeof documents)['query PortfolioXpStats($locale: String) {\n  portfolioXpStats(locale: $locale) {\n    workingDaysPerYear\n    currentLevel\n    currentXp\n    nextLevelXp\n    fill\n    label\n  }\n}'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
