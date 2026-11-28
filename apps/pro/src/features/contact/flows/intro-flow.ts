import caseIcon from '@/_assets/icons/solar-case.svg';
import chatIcon from '@/_assets/icons/solar-chat-round-line.svg';
import lightbulbIcon from '@/_assets/icons/solar-lightbulb.svg';
import userIcon from '@/_assets/icons/solar-user.svg';

import { FIELD_MAXIMUM_LENGTHS, personName } from '../engine/field-validators';
import type { FlowDefinition, StepKey } from '../engine/flow-types';

/** Grupo 01 do design: pergunta o nome e o motivo do contato. O motivo escolhe o fluxo seguinte. */
export const INTRO_FLOW_ID = 'intro';

export const INTRO_NAME_STEP_KEY: StepKey = 'intro.name';

/** As opções desta etapa têm os mesmos ids dos fluxos em `flow-registry.ts`. */
export const INTRO_REASON_STEP_KEY: StepKey = 'intro.reason';

export const introFlow: FlowDefinition = {
  id: INTRO_FLOW_ID,
  steps: [
    {
      id: 'name',
      kind: 'fields',
      progress: 'intro',
      summary: false,
      fields: [
        {
          id: 'name',
          kind: 'text',
          required: true,
          validator: personName({ required: true }),
          maximumLength: FIELD_MAXIMUM_LENGTHS.name,
          icon: userIcon,
          autoComplete: 'given-name',
        },
      ],
    },
    {
      id: 'reason',
      kind: 'cards',
      progress: 'intro',
      navigation: 'hidden',
      options: [
        { id: 'project', icon: lightbulbIcon },
        { id: 'opportunity', icon: caseIcon },
        { id: 'otherSubjects', icon: chatIcon },
      ],
    },
  ],
};
