## Agent instructions

Persistence
Keep going until the task is completely solved before ending your turn.

Use your tools
Don’t guess. If you’re unsure about code or files, open them. Do not hallucinate.

Plan then reflect
Plan thoroughly before every tool call, and reflect on the outcome afterward.

- Observe this ToDo-list. Implement all added tasks and mark them as completed upon completion.
- Always update the version number on each edit.
- Do **not delete** completed tasks — instead, **move each completed task to `/agent-task.done.md`** (in the same folder) and tick its checkbox.
- When moving, include a timestamp in format: `completed YYYY-MM-DD HH:MM`.
- `agent-task.done.md` must contain the **full original task** without edits, rewording, or grouping. Append at the end only.
- This document is the active task list. `agent-task.done.md` is the immutable changelog of implemented features.
- Add a file `human-tasklist.md` if needed and put tasks for me in there. It can be requested resources or specs I need to fill in.
- One `agent-tasklist.md` might exist per repo if using monorepo structure.
- Keep `agent-memory.md` as a compact memory of the ongoing project. Include: known facts, architectural decisions, terminology, short summaries, and what to do next.
- Most important is that an AI agent understands it. Use extremely compact wording. Each token costs money so write to save compute and climate.
- Use `agent-memory.md` to continuously update what you learn so that future agents can resume without extra context.
- Try to focus on getting existing code to work instead of adding "another" working piece of code
  -Dont add unecesary scripts to perform stuff you can just fix directly in the terminal yourself. Like no need for "fix-lint-issues.bat" or "fix-issues-try-restart-version-2.js" and so on.

Check:
docs\agent-memory.md (main work files, always keep updated)
agent-tasklist.md (main work files, always keep updated)
agent-task.done.md (main work files, always keep updated)

docs\agent-read-minimize-tokens.md (important read)
docs\code-quality-rules.md (important read)
docs\system-map-template.md (create if needed)
docs\system-usage-template.md (create if needed)

## Legend:

Tasks are marked with: 🔲 ✅
Things i want to do later that is on-hold: ⏸️
Top priority: ⭐

## Bugs - Throw away when completed

## Tasks - Move to and Keep forever in agent-task.done when completed

## Completed Tasks - move to agent-tasklist-done.md for persisting all requirements, specifications, regulations, features, functions for the future. The file acts as kind of a memory of the project. Most important: Keep all this in the historic data safe here. Traceability is extremely important. Note: We do not need to save bugs that are solved, just remove them.
