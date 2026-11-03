# AGENTS.md

## Project Context

This is a Base44 app repository. Treat it as user-owned application code, keep changes focused on the user's request, and preserve existing project conventions.

Start with `README.md` for local setup, environment variables, and publish workflow.

## Base44 References

- CLI overview: https://docs.db.com/developers/references/cli/get-started/overview.md
- Agent skills: https://docs.db.com/developers/backend/overview/skills.md

If your agent supports Agent Skills, install or update Base44 skills before Base44-specific work:

```bash
npx skills add base44/skills
```

## Installed Skills

Skills are committed in `.agents/skills/`, which is the source of truth. `skills-lock.json` is used only by the CLI (`npx skills update`, `npx skills experimental_install`).

**Base44** (`base44/skills`): `base44-cli`, `base44-platform-platform`, `base44-platform-frontend`,
`base44-platform-entities`, `base44-platform-backend-functions`, `base44-platform-integrations-sdk`,
`base44-platform-workflows`, `base44-sdk`, `base44-troubleshooter`.

**Web quality** (`vercel-labs/agent-skills`): `vercel-react-best-practices`, `web-design-guidelines`,
`vercel-composition-patterns`.

Update with `npx skills update -p -y`. Restore from the lock with `npx skills experimental_install`.

## Key Files

- `src/`: frontend application source.
- `src/api/base44Client.js`: frontend Base44 SDK client.
- `vite.config.js`: Vite config and Base44 Vite plugin setup.
- `.env.local`: local-only environment values; never commit secrets.

## Working Notes

- Use `base44 dev` as the default local development command when you need the local Base44 backend. It can run the backend and frontend together.
- When docs or code mention the frontend being started automatically, that usually means the Base44 project config includes `site.serveCommand`, for example `"serveCommand": "npm run dev"` in `base44/config.jsonc`.
- Use `npm run dev` only for frontend-only work against the hosted Base44 backend.
- Prefer the existing Base44 CLI workflow over adding new npm scripts for Base44-specific tasks.
- Reuse the existing SDK client and Vite plugin patterns before adding new Base44 integration paths.
- Run the relevant checks from `package.json` before finishing code changes.
