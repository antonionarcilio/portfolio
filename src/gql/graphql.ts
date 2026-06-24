/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Enum_Componentportfolioeducation_Degree_Type = 'Associate_Degree' | 'Bachelor_s_Degree' | 'Teaching_Degree';

export type Enum_Portfolio_Seniority = 'junior' | 'mid' | 'senior';

export type I18NLocalesQueryVariables = Exact<{ [key: string]: never }>;

export type I18NLocalesQuery = { i18NLocales: Array<{ name: string | null; code: string | null } | null> };

export type PortfolioQueryVariables = Exact<{
  locale?: unknown;
}>;

export type PortfolioQuery = {
  portfolio: {
    name: string;
    last_name: string | null;
    expertise_area: string;
    seniority: Enum_Portfolio_Seniority | null;
    company: string | null;
    location: string | null;
    highlight_text: string | null;
    experience_months: number | null;
    contact: Array<{ id: string; label: string; url: string } | null> | null;
    skills: Array<{ id: string; name: string; technologies: Array<{ name: string } | null> } | null> | null;
    projects: Array<{
      id: string;
      company: string;
      company_url: string | null;
      project_name: string;
      desc: string;
      start_date: unknown;
      end_date: unknown;
    } | null> | null;
    services: Array<{ id: string; title: string; description: string } | null> | null;
    experience: Array<{
      id: string;
      company: string;
      company_url: string | null;
      expertise_area: string;
      start_date: unknown;
      end_date: unknown;
      details: string | null;
      stack: Array<{ id: string; name: string; technologies: Array<{ name: string } | null> } | null> | null;
    } | null> | null;
    education: Array<{
      id: string;
      title: string;
      institution: string;
      description: string | null;
      year: string | null;
      degree_type: Enum_Componentportfolioeducation_Degree_Type | null;
    } | null> | null;
    achievements: Array<{
      id: string;
      title: string;
      year: string;
      desc: string;
      badge: {
        documentId: string;
        name: string;
        alternativeText: string | null;
        caption: string | null;
        focalPoint: unknown;
        width: number | null;
        height: number | null;
        formats: unknown;
        hash: string;
        ext: string | null;
        mime: string;
        size: number;
        url: string;
      };
    } | null> | null;
  } | null;
};

export type PortfolioXpStatsQueryVariables = Exact<{
  locale?: string | null | undefined;
}>;

export type PortfolioXpStatsQuery = {
  portfolioXpStats: {
    workingDaysPerYear: number;
    currentLevel: number;
    currentXp: number;
    nextLevelXp: number;
    fill: number;
    label: string;
  } | null;
};

export const I18NLocalesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'I18NLocales' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'i18NLocales' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<I18NLocalesQuery, I18NLocalesQueryVariables>;
export const PortfolioDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Portfolio' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'I18NLocaleCode' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'portfolio' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'locale' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'last_name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expertise_area' } },
                { kind: 'Field', name: { kind: 'Name', value: 'seniority' } },
                { kind: 'Field', name: { kind: 'Name', value: 'company' } },
                { kind: 'Field', name: { kind: 'Name', value: 'location' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contact' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'highlight_text' } },
                { kind: 'Field', name: { kind: 'Name', value: 'experience_months' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'skills' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'technologies' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projects' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'company' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'company_url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'project_name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'desc' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'start_date' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'end_date' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'services' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'experience' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'company' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'company_url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'expertise_area' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'start_date' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'end_date' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'details' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stack' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'technologies' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [{ kind: 'Field', name: { kind: 'Name', value: 'name' } }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'education' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'institution' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'year' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'degree_type' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'achievements' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'badge' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'alternativeText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'caption' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'focalPoint' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'formats' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'hash' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'ext' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'year' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'desc' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PortfolioQuery, PortfolioQueryVariables>;
export const PortfolioXpStatsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PortfolioXpStats' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'portfolioXpStats' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'locale' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'workingDaysPerYear' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currentLevel' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currentXp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'nextLevelXp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fill' } },
                { kind: 'Field', name: { kind: 'Name', value: 'label' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PortfolioXpStatsQuery, PortfolioXpStatsQueryVariables>;
