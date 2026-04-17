# GitHub Copilot Hands-On

A hands-on workshop repository for the **GitHub Copilot Dev Days** event. Explore AI-powered development with GitHub Copilot through practical, guided exercises.

## What's Inside

This repo contains interactive activities designed to help you:

- **Get started with GitHub Copilot** — Set up and configure Copilot in VS Code
- **Write code faster** — Use Copilot for code completion, generation, and refactoring
- **Chat & agents** — Leverage Copilot Chat, inline chat, and custom agents
- **Real-world workflows** — Apply Copilot to debugging, testing, documentation, and more

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) (latest)
- [GitHub Copilot](https://github.com/features/copilot) subscription (Free, Pro, or Enterprise)
- Git installed and configured

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/defnotwig/copilot-hands-on.git
   cd copilot-hands-on
   ```
2. Open in VS Code:
   ```bash
   code .
   ```
3. Follow the exercises in order.

## Codebase Fixes Applied

The eCommApp (The Daily Harvest) has been audited and patched: XSS vulnerabilities removed (`dangerouslySetInnerHTML` replaced with safe text rendering in AdminPage and ReviewModal), invalid HTML nesting fixed (HomePage, Header, AdminPage), modals refactored to native `<dialog>` elements for accessibility, React Router v7 future flags enabled, CartContext optimized with `useMemo`/`useCallback`, WCAG contrast ratios corrected, focus-visible keyboard styles added, and missing favicon resolved.

## Premium Frontend UI & Production Enhancements

The app received a full premium UI overhaul: dark emerald/gold design system with CSS custom properties, glassmorphism header/footer, Framer Motion page transitions with `AnimatePresence` and staggered card reveals, `React.lazy` + `Suspense` route-level code splitting, an `ErrorBoundary` class component, `useReducedMotion()` accessibility hooks on all animated pages, WCAG AA contrast compliance, and `prefers-reduced-motion` CSS-level animation disabling. The test suite now includes **140 tests across 14 files with 100% statement/function/line coverage** (Vitest + React Testing Library).

## License

MIT
