/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ComponentPortfolioProjectFiltersInput = {
  and?: Array<ComponentPortfolioProjectFiltersInput | null | undefined> | null | undefined;
  company?: StringFilterInput | null | undefined;
  company_url?: StringFilterInput | null | undefined;
  desc?: StringFilterInput | null | undefined;
  end_date?: DateFilterInput | null | undefined;
  not?: ComponentPortfolioProjectFiltersInput | null | undefined;
  or?: Array<ComponentPortfolioProjectFiltersInput | null | undefined> | null | undefined;
  project_name?: StringFilterInput | null | undefined;
  stack?: StackFiltersInput | null | undefined;
  start_date?: DateFilterInput | null | undefined;
};

export type DateFilterInput = {
  and?: Array<unknown> | null | undefined;
  between?: Array<unknown> | null | undefined;
  contains?: unknown;
  containsi?: unknown;
  endsWith?: unknown;
  eq?: unknown;
  eqi?: unknown;
  gt?: unknown;
  gte?: unknown;
  in?: Array<unknown> | null | undefined;
  lt?: unknown;
  lte?: unknown;
  ne?: unknown;
  nei?: unknown;
  not?: DateFilterInput | null | undefined;
  notContains?: unknown;
  notContainsi?: unknown;
  notIn?: Array<unknown> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<unknown> | null | undefined;
  startsWith?: unknown;
};

export type DateTimeFilterInput = {
  and?: Array<unknown> | null | undefined;
  between?: Array<unknown> | null | undefined;
  contains?: unknown;
  containsi?: unknown;
  endsWith?: unknown;
  eq?: unknown;
  eqi?: unknown;
  gt?: unknown;
  gte?: unknown;
  in?: Array<unknown> | null | undefined;
  lt?: unknown;
  lte?: unknown;
  ne?: unknown;
  nei?: unknown;
  not?: DateTimeFilterInput | null | undefined;
  notContains?: unknown;
  notContainsi?: unknown;
  notIn?: Array<unknown> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<unknown> | null | undefined;
  startsWith?: unknown;
};

export type Enum_Componentportfolioeducation_Degree_Type = 'Associate_Degree' | 'Bachelor_s_Degree' | 'Teaching_Degree';

export type Enum_Portfolio_Seniority = 'junior' | 'mid' | 'senior';

export type IdFilterInput = {
  and?: Array<string | number | null | undefined> | null | undefined;
  between?: Array<string | number | null | undefined> | null | undefined;
  contains?: string | number | null | undefined;
  containsi?: string | number | null | undefined;
  endsWith?: string | number | null | undefined;
  eq?: string | number | null | undefined;
  eqi?: string | number | null | undefined;
  gt?: string | number | null | undefined;
  gte?: string | number | null | undefined;
  in?: Array<string | number | null | undefined> | null | undefined;
  lt?: string | number | null | undefined;
  lte?: string | number | null | undefined;
  ne?: string | number | null | undefined;
  nei?: string | number | null | undefined;
  not?: IdFilterInput | null | undefined;
  notContains?: string | number | null | undefined;
  notContainsi?: string | number | null | undefined;
  notIn?: Array<string | number | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<string | number | null | undefined> | null | undefined;
  startsWith?: string | number | null | undefined;
};

export type IntFilterInput = {
  and?: Array<number | null | undefined> | null | undefined;
  between?: Array<number | null | undefined> | null | undefined;
  contains?: number | null | undefined;
  containsi?: number | null | undefined;
  endsWith?: number | null | undefined;
  eq?: number | null | undefined;
  eqi?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  in?: Array<number | null | undefined> | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
  ne?: number | null | undefined;
  nei?: number | null | undefined;
  not?: IntFilterInput | null | undefined;
  notContains?: number | null | undefined;
  notContainsi?: number | null | undefined;
  notIn?: Array<number | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<number | null | undefined> | null | undefined;
  startsWith?: number | null | undefined;
};

export type StackFiltersInput = {
  and?: Array<StackFiltersInput | null | undefined> | null | undefined;
  createdAt?: DateTimeFilterInput | null | undefined;
  documentId?: IdFilterInput | null | undefined;
  not?: StackFiltersInput | null | undefined;
  or?: Array<StackFiltersInput | null | undefined> | null | undefined;
  project_name?: StringFilterInput | null | undefined;
  publishedAt?: DateTimeFilterInput | null | undefined;
  technologies?: TechnologyFiltersInput | null | undefined;
  updatedAt?: DateTimeFilterInput | null | undefined;
};

export type StringFilterInput = {
  and?: Array<string | null | undefined> | null | undefined;
  between?: Array<string | null | undefined> | null | undefined;
  contains?: string | null | undefined;
  containsi?: string | null | undefined;
  endsWith?: string | null | undefined;
  eq?: string | null | undefined;
  eqi?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: Array<string | null | undefined> | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  ne?: string | null | undefined;
  nei?: string | null | undefined;
  not?: StringFilterInput | null | undefined;
  notContains?: string | null | undefined;
  notContainsi?: string | null | undefined;
  notIn?: Array<string | null | undefined> | null | undefined;
  notNull?: boolean | null | undefined;
  null?: boolean | null | undefined;
  or?: Array<string | null | undefined> | null | undefined;
  startsWith?: string | null | undefined;
};

export type TechnologyFiltersInput = {
  and?: Array<TechnologyFiltersInput | null | undefined> | null | undefined;
  createdAt?: DateTimeFilterInput | null | undefined;
  documentId?: IdFilterInput | null | undefined;
  name?: StringFilterInput | null | undefined;
  not?: TechnologyFiltersInput | null | undefined;
  or?: Array<TechnologyFiltersInput | null | undefined> | null | undefined;
  proficiency_level?: IntFilterInput | null | undefined;
  publishedAt?: DateTimeFilterInput | null | undefined;
  updatedAt?: DateTimeFilterInput | null | undefined;
};

export type ContactQueryVariables = Exact<{
  documentId: string | number;
}>;

export type ContactQuery = { contact: { documentId: string; url: string; label: string } | null };

export type ContactsQueryVariables = Exact<{
  sort?: Array<string | null | undefined> | string | null | undefined;
}>;

export type ContactsQuery = { contacts: Array<{ documentId: string; label: string; url: string } | null> };

export type I18NLocalesQueryVariables = Exact<{ [key: string]: never }>;

export type I18NLocalesQuery = { i18NLocales: Array<{ name: string | null; code: string | null } | null> };

export type PortfolioQueryVariables = Exact<{
  locale?: unknown;
  educationSort?: Array<string | null | undefined> | string | null | undefined;
  achievementsSort?: Array<string | null | undefined> | string | null | undefined;
  contactSort?: Array<string | null | undefined> | string | null | undefined;
  experienceSort?: Array<string | null | undefined> | string | null | undefined;
  projectsSort?: Array<string | null | undefined> | string | null | undefined;
  servicesSort?: Array<string | null | undefined> | string | null | undefined;
  skillsSort?: Array<string | null | undefined> | string | null | undefined;
  experienceTechSort?: Array<string | null | undefined> | string | null | undefined;
  skillsTechSort?: Array<string | null | undefined> | string | null | undefined;
  projectsTechSort?: Array<string | null | undefined> | string | null | undefined;
  experienceStacksSort?: Array<string | null | undefined> | string | null | undefined;
}>;

export type PortfolioQuery = {
  portfolio: {
    name: string;
    last_name: string | null;
    expertise_area: string;
    seniority: Enum_Portfolio_Seniority | null;
    company: string | null;
    location: string | null;
    documentId: string;
    highlight_text: string | null;
    experience_months: number | null;
    skills: Array<{
      id: string;
      skill_group: { name: string; short_description: string } | null;
      technologies: Array<{ name: string; proficiency_level: number | null } | null>;
      icon: { documentId: string; name: string; width: number | null; height: number | null; url: string } | null;
    } | null> | null;
    projects: Array<{
      id: string;
      company: string;
      company_url: string | null;
      project_name: string;
      desc: string;
      start_date: unknown;
      end_date: unknown;
      stack: {
        project_name: string;
        technologies: Array<{ name: string; proficiency_level: number | null } | null>;
      } | null;
      preview: {
        alternativeText: string | null;
        formats: unknown;
        height: number | null;
        name: string;
        url: string;
        width: number | null;
        documentId: string;
      } | null;
    } | null> | null;
    services: Array<{
      id: string;
      title: string;
      description: string;
      contact: { url: string; label: string; documentId: string } | null;
    } | null> | null;
    experience: Array<{
      id: string;
      company: string;
      company_url: string | null;
      expertise_area: string;
      start_date: unknown;
      end_date: unknown;
      details: string | null;
      stacks: Array<{
        project_name: string;
        documentId: string;
        technologies: Array<{ proficiency_level: number | null; name: string } | null>;
      } | null>;
    } | null> | null;
    education: Array<{
      id: string;
      title: string;
      institution: string;
      description: string | null;
      year: unknown;
      degree_type: Enum_Componentportfolioeducation_Degree_Type | null;
    } | null> | null;
    achievements: Array<{
      id: string;
      title: string;
      year: unknown;
      desc: string;
      badge: {
        documentId: string;
        name: string;
        alternativeText: string | null;
        width: number | null;
        height: number | null;
        formats: unknown;
        mime: string;
        url: string;
      };
    } | null> | null;
    contact: Array<{ label: string; url: string; documentId: string; name: string; tooltip: string | null } | null>;
  } | null;
};

export type ProjectsQueryVariables = Exact<{
  sort?: Array<string | null | undefined> | string | null | undefined;
  filters?: ComponentPortfolioProjectFiltersInput | null | undefined;
  locale?: unknown;
}>;

export type ProjectsQuery = {
  portfolio: {
    projects: Array<{
      id: string;
      company: string;
      company_url: string | null;
      project_name: string;
      desc: string;
      start_date: unknown;
      end_date: unknown;
      stack: { technologies: Array<{ name: string; proficiency_level: number | null } | null> } | null;
      preview: {
        url: string;
        width: number | null;
        height: number | null;
        formats: unknown;
        alternativeText: string | null;
      } | null;
    } | null> | null;
  } | null;
};

export type SkillsQueryVariables = Exact<{
  locale?: unknown;
  sort?: Array<string | null | undefined> | string | null | undefined;
  techSort?: Array<string | null | undefined> | string | null | undefined;
}>;

export type SkillsQuery = {
  portfolio: {
    documentId: string;
    skills: Array<{
      id: string;
      skill_group: { name: string; short_description: string } | null;
      technologies: Array<{ documentId: string; name: string; proficiency_level: number | null } | null>;
      icon: { documentId: string; name: string; width: number | null; height: number | null; url: string } | null;
    } | null> | null;
  } | null;
};

export type StackQueryVariables = Exact<{
  documentId: string | number;
  sort?: Array<string | null | undefined> | string | null | undefined;
}>;

export type StackQuery = {
  stack: {
    documentId: string;
    project_name: string;
    technologies: Array<{ name: string; proficiency_level: number | null } | null>;
  } | null;
};

export type StacksQueryVariables = Exact<{
  sort?: Array<string | null | undefined> | string | null | undefined;
}>;

export type StacksQuery = {
  stacks: Array<{
    documentId: string;
    project_name: string;
    technologies: Array<{ name: string; proficiency_level: number | null } | null>;
  } | null>;
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

export const ContactDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Contact' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'documentId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contact' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'documentId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'documentId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                { kind: 'Field', name: { kind: 'Name', value: 'label' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ContactQuery, ContactQueryVariables>;
export const ContactsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Contacts' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contacts' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sort' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                { kind: 'Field', name: { kind: 'Name', value: 'url' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ContactsQuery, ContactsQueryVariables>;
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
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'educationSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'achievementsSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'contactSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'experienceSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectsSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'servicesSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skillsSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'experienceTechSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'skillsTechSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'projectsTechSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'experienceStacksSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'highlight_text' } },
                { kind: 'Field', name: { kind: 'Name', value: 'experience_months' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'skills' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'skillsSort' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'skill_group' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'short_description' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'technologies' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'sort' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'skillsTechSort' } },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'proficiency_level' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'icon' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projects' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'projectsSort' } },
                    },
                  ],
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stack' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'project_name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'technologies' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'sort' },
                                  value: { kind: 'Variable', name: { kind: 'Name', value: 'projectsTechSort' } },
                                },
                              ],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'proficiency_level' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'preview' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'alternativeText' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'formats' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'services' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'servicesSort' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contact' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'experience' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'experienceSort' } },
                    },
                  ],
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
                        name: { kind: 'Name', value: 'stacks' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'sort' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'experienceStacksSort' } },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'project_name' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'technologies' },
                              arguments: [
                                {
                                  kind: 'Argument',
                                  name: { kind: 'Name', value: 'sort' },
                                  value: { kind: 'Variable', name: { kind: 'Name', value: 'experienceTechSort' } },
                                },
                              ],
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'proficiency_level' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'education' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'educationSort' } },
                    },
                  ],
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
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'achievementsSort' } },
                    },
                  ],
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
                            { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'formats' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'mime' } },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'contact' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'contactSort' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'label' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tooltip' } },
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
export const ProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Projects' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ComponentPortfolioProjectFiltersInput' } },
        },
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
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projects' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'filters' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
                    },
                  ],
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'stack' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'technologies' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'proficiency_level' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'preview' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'formats' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'alternativeText' } },
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
      },
    },
  ],
} as unknown as DocumentNode<ProjectsQuery, ProjectsQueryVariables>;
export const SkillsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Skills' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'locale' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'I18NLocaleCode' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'techSort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'skills' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'skill_group' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'short_description' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'technologies' },
                        arguments: [
                          {
                            kind: 'Argument',
                            name: { kind: 'Name', value: 'sort' },
                            value: { kind: 'Variable', name: { kind: 'Name', value: 'techSort' } },
                          },
                        ],
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'proficiency_level' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'icon' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'url' } },
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
      },
    },
  ],
} as unknown as DocumentNode<SkillsQuery, SkillsQueryVariables>;
export const StackDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Stack' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'documentId' } },
          type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stack' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'documentId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'documentId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'project_name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'technologies' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'sort' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'proficiency_level' } },
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
} as unknown as DocumentNode<StackQuery, StackQueryVariables>;
export const StacksDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Stacks' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'ListType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stacks' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sort' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'documentId' } },
                { kind: 'Field', name: { kind: 'Name', value: 'project_name' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'technologies' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'proficiency_level' } },
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
} as unknown as DocumentNode<StacksQuery, StacksQueryVariables>;
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
