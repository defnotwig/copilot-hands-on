---
mode: agent
description: Generate a comprehensive unit test file for a React component
---

Create a Vitest + React Testing Library test file for the specified component.

Requirements:
- Import from `@testing-library/react`, `@testing-library/user-event`, and `vitest`
- Use `renderWithProviders` from `../test/test-utils` if CartContext is needed
- Mock `globalThis.fetch` for any component that loads data
- Test all user interactions, conditional branches, error states
- Use `screen.getByRole`, `screen.getByText`, `screen.getByPlaceholderText` for queries
- Test accessibility: aria labels, button roles, heading levels
- Target 100% branch coverage
- Follow the existing test patterns in the codebase
