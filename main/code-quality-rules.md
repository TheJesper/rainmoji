### Code‑Quality Rules (ultra‑compact)

**Files & Folders**

- Files ≤ 200 LOC (only more as exceptions, for i.e. workflows only if needed)
- Functions ≤ 30 LOC
- ≤ 7 items per folder
- Index files: re‑export only
- No code files in root

**Component Boundaries**

- One public symbol per module
- Inputs explicit params only
- Outputs = return / raise
- No cross‑layer imports
- Contracts = DTOs

**Naming & Intent**

- Names show _why_, not _how_
- Domain terms for business, CS for infra
- No “Mgr/Data/foo\_” suffixes

**Logic Structure**

- Guard clauses first
- Max 1 loop _or_ 1 if per function
- Queries pure, commands imperative

**Error Handling**

- Validate early, raise typed
- Never swallow; log or propagate
- Separate expected vs unexpected

**State & Immutability**

- Prefer immutables
- One shared‑state source

**Clean Code**

- DRY
- Delete dead code
- Comments explain _why_
- Side‑effects only in `save_*`, `send_*`…

**Testing & CI**

- Unit‑test every branch; integrate flows
- Core logic fully covered
- CI blocks on lint/tests/format

**Automation & Style**

- Enforce formatter + linter
- Warnings = errors
- Main always green

**Security**

- No secrets in repo; scan in CI

**Performance**

- Block PRs that regress latency/memory

**Observability**

- Log structured events with trace‑id

**Dependency Hygiene**

- Pin + audit deps; prune monthly

**API Compatibility**

- Version APIs; deprecate with notice

**Documentation**

- Public modules need ≤ 5‑line example

**Accessibility (UI)**

- Meet WCAG 2.1 AA

**Code Review**

- ≥ 1 reviewer + all checks green

**Repo Hygiene / Tokens**

- Move unused files to `to-delete/`
- Ignore generated artifacts
