# Security Policy

## Scope

This is an experimental news dashboard. It currently retrieves a public RSS feed and exposes the resulting entries through an Express API.

## Reporting a vulnerability

Please report security issues privately to the repository maintainer through GitHub's available private vulnerability reporting channel, if enabled. If private reporting is unavailable, contact the maintainer directly through a trusted channel before publishing technical details.

Include:

- A concise description of the issue
- Steps to reproduce
- Potential impact
- A suggested mitigation, if known

Please do not include credentials, tokens, private URLs, or personal data in a public issue.

## Security considerations

- Treat RSS content and article links as untrusted external input.
- Do not add secrets or credentials to source control.
- Validate and constrain any future user-configurable feed URLs to reduce server-side request forgery (SSRF) risk.
- Keep dependencies updated and review changes that affect network access or HTML rendering.
