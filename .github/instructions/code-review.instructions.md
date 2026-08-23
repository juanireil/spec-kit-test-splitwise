---
applyTo: "**/*.{ts,js,py,go,cs}"
---

# Code Review Standards

When reviewing code, always check:

## Security

- No hardcoded secrets, tokens, or connection strings.
- All user input is validated and sanitised before use.
- SQL queries use parameterised statements.
- No sensitive data logged at INFO level or above.

## Reliability

- All async operations have proper error handling.
- Network calls include timeouts and retry logic.
- Resource cleanup is handled in finally blocks or using statements.

## Maintainability

- Functions do one thing and are under 40 lines where practical.
- Variable names are descriptive and follow project conventions.
- No commented-out code left in place. Use version control instead.

## Performance

- No unnecessary allocations in hot paths.
- Database queries are indexed and avoid N+1 patterns.
- Large collections use streaming or pagination rather than loading everything into memory.
