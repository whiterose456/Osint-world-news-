# Contributing

Thanks for considering a contribution to OSINT World News.

## Development setup

1. Install Node.js and npm.
2. Clone the repository.
3. Install dependencies with `npm install`.
4. Start both services with `npm run dev`.
5. Open `http://localhost:5173`.

## Suggested workflow

1. Create a focused branch from `main`.
2. Keep changes scoped to one feature or fix.
3. Run `npm run build` before submitting.
4. Describe the motivation, implementation, and any known limitations in your pull request.
5. Include screenshots for visible UI changes when practical.

## Contribution guidelines

- Keep TypeScript types clear and avoid introducing `any` where practical.
- Preserve source attribution and links to original reporting.
- Do not present heuristic categories, severity labels, or map coordinates as verified facts.
- Handle missing or malformed RSS fields safely.
- Avoid committing API keys, credentials, private URLs, or personal data.
- Add tests when introducing or changing parsing and classification behavior.

## Reporting issues

Include steps to reproduce, expected behavior, actual behavior, and relevant browser/server logs. Remove secrets and personal information before posting logs.
