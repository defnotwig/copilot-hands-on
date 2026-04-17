# The Daily Harvest — Copilot Instructions

## Project Overview
This is "The Daily Harvest", a React 18 + TypeScript eCommerce application built with Vite.
It sells fresh produce (fruits) with product browsing, reviews, cart, checkout, and admin capabilities.

## Tech Stack
- **Frontend**: React 18.2.0, TypeScript 5, Vite 4.4.5
- **Routing**: React Router DOM 6.15 (with v7 future flags)
- **Animation**: Framer Motion (page transitions, staggered card reveals)
- **Testing**: Vitest 3.2.4 + React Testing Library + jsdom
- **Coverage**: 100% across statements, branches, functions, lines

## Code Conventions
- Use functional components with hooks (no class components except ErrorBoundary)
- Use `motion.div` / `motion.h2` from framer-motion for animations
- Use native HTML `<dialog>` element for modals (not div-based overlays)
- Always include `aria-labelledby` on dialog elements
- Use `useRef<HTMLDialogElement>` with `showModal()` / `close()` for dialog control
- CSS uses custom properties defined in `index.css` (e.g., `var(--color-accent)`)
- Use `clamp()` for responsive typography
- Include `prefers-reduced-motion` media query for all animations
- Wrap clickable images in `<button type="button">` with `aria-label`
- Never use `dangerouslySetInnerHTML`
- Validate with `Number.isNaN()` instead of global `isNaN()`
- Use `globalThis` instead of `global` in test files

## File Structure
```
eCommApp/
├── src/
│   ├── components/   # React components (pages + shared)
│   ├── context/      # CartContext with useMemo/useCallback
│   ├── types/        # TypeScript interfaces (excluded from coverage)
│   ├── utils/        # Helper functions (formatPrice, calculateTotal, validateEmail)
│   ├── test/         # Test setup + custom render utility
│   ├── App.tsx       # Routes with AnimatePresence + lazy loading + ErrorBoundary
│   ├── App.css       # Premium design system styles
│   └── index.css     # CSS custom properties / design tokens
├── public/products/  # Product JSON + images
└── package.json
```

## Testing Guidelines
- Test files live alongside source in `src/components/` or `src/`
- Use `renderWithProviders` from `test/test-utils.tsx` for components needing CartContext
- Mock `globalThis.fetch` (not `global.fetch`) in product loading tests
- Mock `HTMLDialogElement.prototype.showModal` and `.close` (jsdom doesn't support them)
- Use `MemoryRouter` with `initialEntries` for route tests
- Target 100% coverage — all branches must be exercised
