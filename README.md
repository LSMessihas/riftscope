# RiftScope

RiftScope is the initial structure for a League of Legends stats website built with Next.js, TypeScript, and Tailwind CSS.

The current version focuses on a clean, mobile-first foundation with a gaming-inspired UI, reusable components, and placeholder pages that are ready for future Riot API integration.

## Tech Stack

- Next.js 14 with the App Router
- TypeScript
- Tailwind CSS
- ESLint

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Project Structure

```text
app/
  layout.tsx                Global layout and metadata
  page.tsx                  Homepage
  globals.css               Tailwind imports and global styles
  player-profile/page.tsx   Player profile placeholder page
  recent-matches/page.tsx   Recent matches placeholder page
  top-champions/page.tsx    Top champions placeholder page

components/
  feature-card.tsx          Homepage feature links
  placeholder-page.tsx      Reusable placeholder layout
  search-panel.tsx          Riot ID search UI block
  site-header.tsx           Header with branding and navigation

package.json                Scripts and dependencies
tailwind.config.ts          Tailwind theme extensions
postcss.config.js           Tailwind PostCSS integration
tsconfig.json               TypeScript configuration
next.config.mjs             Next.js configuration
```

## Current Pages

- `/` homepage with the RiftScope title, subtitle, Riot ID search bar, region selector, and CTA button
- `/player-profile` placeholder page
- `/recent-matches` placeholder page
- `/top-champions` placeholder page

## Notes For Future Development

- No external API is connected yet
- The search form is static on purpose
- Shared components are separated early to keep the codebase easy to scale
- Comments are included where they help explain intent without adding noise

## Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs linting
