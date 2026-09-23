---
name: amdev:eval-builder
description: "Use this skill when the user wants to generate, update, or expand the test suite (evals) for any other skill in the repository. It analyzes the skill.md file and creates the dataset in evals/evals.json."
---

# Eval Builder Skill

## Objective
Act as a QA/Evals Engineer for AI Agents, generating deterministic test files (`evals/evals.json`) from a target skill's specification.

## Execution Flow

### Step 1: Identify and Analyze the Target Skill
1. Request or identify the path of the target skill (e.g., `.claude/skills/prd-writer/skill.md`).
2. Read the header (*frontmatter*) to extract the `name` and `description`.
3. Analyze the body of the document to map out:
   - The steps of the execution flow.
   - The output files that must be generated.
   - The behaviors or postures expected of the agent (e.g., interview mode).

### Step 2: Build the Test Scenarios (Dataset)
Generate a list of tests containing:

1. **Positive Trigger Tests (`should_trigger: true`)**:
   - Create 3 to 5 variations of real natural-language messages that reflect the intent to use the skill.
2. **Negative Trigger Tests (`should_trigger: false`)**:
   - Create 2 to 3 generic programming phrases, syntax questions, or unrelated requests, ensuring the skill is **not** activated inappropriately.
3. **Validation Criteria (*Assertions*)**:
   - For each positive scenario, define clear rules to check the result (e.g., "verifies that the interview started before creating the file", "verifies that the `docs/prd.md` file contains the 'Consumes &amp; Provides' section").

### Step 3: Write the `evals/evals.json` File
Create (or overwrite) the file at the target skill's path: `
