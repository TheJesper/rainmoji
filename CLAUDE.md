# RainMoji Library - emoji-rain-parallax

## Identity
- **Project**: RainMoji (rainmoji)
- **Package**: `emoji-rain-parallax` on npm
- **Type**: Open source React component library
- **Stack**: React + TypeScript + Webpack

## GitHub
- **Main Repo**: https://github.com/TheJesper/rainmoji (THIS IS THE MAIN REPO)
- **Related**: https://github.com/TheJesper/rainmoji-web (demo/docs site)

## Public Repository - Security Rules
This is a PUBLIC open source npm package. NEVER commit:
- `.env` files or any secrets
- API keys, tokens, or credentials
- Internal URLs or private IPs
- Build artifacts (already gitignored)

## Orchestrator Integration
- **Standards**: `W:\workprocess\_agent-orchestration\process\standards\GOLDEN-RULES-CONCISE.md`
- **Task Prefix**: RMOJ
- **Registry**: `rainmoji` in repo-registry.json

## Quick Reference
- Build: `npm run build`
- Test: `npm test`
- Publish: `npm publish` (to npm registry)
- Tasks: See `at.md` in project root

## Package Info
- Published as `emoji-rain-parallax` on npm
- Zero runtime dependencies
- React 18+ compatible

---

## Spec-Driven Development (SDD) Governance

This project uses SDD. All agents are bound by the SDD constitution.

### Before ANY implementation work:
1. Read `.sdd/constitution.md`
2. Read `.sdd/registry.md` — find the relevant spec
3. Verify spec status is "approved" or "in-progress"
4. Check `Claimed-By` and `.sdd/locks/` — do not work on claimed specs
5. Read the spec chain: `spec.md` -> `plan.md` -> `tasks/<N>.md`
6. Read only files listed in `## Context Files` of the task
7. Confirm tests exist and are failing for the target task
8. If anything is missing -> STOP and report. Do not improvise.

### During implementation:
- One task = one commit
- Do not modify files outside the task's scope
- Do not weaken tests to make them pass
- Do not modify specs -- file a spec change request instead
- Review code quality every 3-4 tasks

### On failure (after 3 attempts):
- Revert changes
- Run `.sdd/hooks/report-failure.sh SPEC-ID TASK-NUM "reason"`
- Release lock and registry claim

### On completion:
- All tests pass
- Commit: feat(SPEC-<ID>): task <NNN> -- <description>
- Update registry, delete lock file, clear claim
