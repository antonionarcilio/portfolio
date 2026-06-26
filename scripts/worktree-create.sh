#!/usr/bin/env bash
# Creates a git worktree linked to the current branch.

set -euo pipefail

# --- colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

die() { echo -e "${RED}Error: $1${RESET}" >&2; exit 1; }
info() { echo -e "  ${CYAN}→${RESET} $1"; }
ok()   { echo -e "  ${GREEN}✔${RESET} $1"; }
warn() { echo -e "  ${YELLOW}✗${RESET} $1"; }

# --- guards ---
git rev-parse --git-dir > /dev/null 2>&1 || die "Not inside a git repository."

PROJECT_ROOT=$(git rev-parse --show-toplevel)
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null) \
  || die "HEAD is detached. Checkout a branch before creating a worktree."

echo -e "${BOLD}${CYAN}=== Git Worktree Creator ===${RESET}"
info "Repository : ${YELLOW}${PROJECT_ROOT}${RESET}"
info "Branch     : ${YELLOW}${CURRENT_BRANCH}${RESET}"
echo ""

# --- 1. base path ---
read -rp "$(echo -e "Worktree base path ${CYAN}[.worktree]${RESET}: ")" BASE_PATH
BASE_PATH="${BASE_PATH:-.worktree}"
BASE_PATH="${BASE_PATH%/}"

# Resolve relative to project root
[[ "$BASE_PATH" != /* ]] && BASE_PATH="${PROJECT_ROOT}/${BASE_PATH}"

# --- 2. branch name ---
while true; do
  read -rp "$(echo -e "New branch name: ")" BRANCH_NAME
  [[ -n "$BRANCH_NAME" ]] && break
  echo -e "${RED}  Branch name cannot be empty.${RESET}"
done

WORKTREE_PATH="${BASE_PATH}/${BRANCH_NAME}"

[[ -d "$WORKTREE_PATH" ]] && die "Directory '${WORKTREE_PATH}' already exists."

# --- summary before acting ---
echo ""
info "New branch  : ${YELLOW}${BRANCH_NAME}${RESET} (from ${YELLOW}${CURRENT_BRANCH}${RESET})"
info "Worktree at : ${YELLOW}${WORKTREE_PATH}${RESET}"
echo ""

# --- 3. create worktree ---
if git show-ref --verify --quiet "refs/heads/${BRANCH_NAME}"; then
  echo -e "${YELLOW}Branch '${BRANCH_NAME}' already exists — linking without creating a new branch.${RESET}"
  git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
else
  git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "$CURRENT_BRANCH"
fi

ok "${GREEN}Worktree created!${RESET}"

# --- 4. auto-detect .env* files and offer to copy each one ---
ENV_CANDIDATES=(.env .env.local .env.development .env.production .env.staging)
FOUND_ENV=()
for F in "${ENV_CANDIDATES[@]}"; do
  [[ -f "${PROJECT_ROOT}/${F}" ]] && FOUND_ENV+=("$F")
done

if [[ ${#FOUND_ENV[@]} -gt 0 ]]; then
  echo ""
  echo -e "${BOLD}  Env files detected in project root:${RESET}"
  COPIED_ENV=0
  for F in "${FOUND_ENV[@]}"; do
    read -rp "$(echo -e "  Copy ${YELLOW}${F}${RESET} to worktree? ${CYAN}[Y/n]${RESET}: ")" COPY_ENV
    if [[ ! "$COPY_ENV" =~ ^[Nn]$ ]]; then
      cp "${PROJECT_ROOT}/${F}" "${WORKTREE_PATH}/${F}"
      ok "Copied ${F}"
      (( COPIED_ENV++ )) || true
    else
      warn "Skipped ${F}"
    fi
  done
fi

# --- 5. optional: copy extra files ---
echo ""
read -rp "$(echo -e "Copy additional files to the worktree? ${CYAN}[y/N]${RESET}: ")" COPY_ANSWER

if [[ "$COPY_ANSWER" =~ ^[Yy]$ ]]; then
  read -rp "$(echo -e "  Files to copy (space-separated): ")" -a FILES_INPUT

  COPIED=0
  SKIPPED=0
  for FILE in "${FILES_INPUT[@]}"; do
    SRC="${PROJECT_ROOT}/${FILE}"
    DST="${WORKTREE_PATH}/${FILE}"
    if [[ -f "$SRC" ]]; then
      mkdir -p "$(dirname "$DST")"
      cp "$SRC" "$DST"
      ok "Copied  ${FILE}"
      (( COPIED++ )) || true
    else
      warn "Skipped ${FILE} (not found in project root)"
      (( SKIPPED++ )) || true
    fi
  done

  echo ""
  info "${COPIED} file(s) copied, ${SKIPPED} skipped."
fi

# --- done ---
echo ""
echo -e "${BOLD}${GREEN}All done!${RESET}"
echo -e "  ${CYAN}cd ${WORKTREE_PATH}${RESET}"
echo ""
