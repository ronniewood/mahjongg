# Mahjong App — Project Context for Claude

## What We're Building
A **single-player American Mahjong trainer** (NMJL style):
- 1 human player + 3 virtual (auto) players
- Purpose: help the player learn hand recognition, passing strategy, and tile selection
- Full Charleston passing simulation (virtual players pass automatically)
- NMJL 2026 card hand matching engine
- Pass advisor (suggests which 3 tiles to pass based on hand probability)
- After each pass, player sees their updated hand and can re-evaluate
- Hint button: top 3 hands by probability (future paywall)
- Other players' hands hidden until played
- MVP is client-side only → Vercel deploy
- Phase 2: auth (Clerk or Auth0)
- Phase 3: subscription + Stripe payments

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- localStorage for MVP persistence
- No backend for MVP

## Current Status
**Card hands complete. Next: fix blank screen bug.**
- Vite + React + Tailwind scaffolded and building cleanly
- All core files written: tiles.js, nmjl2026.js, charleston.js, scorer.js, GameContext.jsx, all components
- nmjl2026.js fully updated with all confirmed 2026 card hands (no stubs remain)
- App renders blank green screen (runtime JS error — not a build error)
- Bug to debug: open browser devtools console at http://localhost:5173 to find the error

## Next Steps
1. **Fix blank screen bug** — run `npm run dev` then check browser devtools console for the JS error
2. Auto-pass logic for the 3 virtual players
3. Pass history panel
4. UI polish

## Card Images (if re-OCR needed)
- `/Users/ronwood/Downloads/IMG_3247.HEIC` (Winds/Dragons, 369, Singles & Pairs)
- `/Users/ronwood/Downloads/IMG_3246.HEIC` (Quints, Consecutive Run, 13579)
- `/Users/ronwood/Downloads/IMG_3245.HEIC` (2026, 2468, Any Like Numbers)
- Convert with: `sips -Z 2400 -s format jpeg -s formatOptions 85 <input> --out /tmp/cardN.jpg`

## Key Domain Rules
- White Dragon = "0", can be used with any suit
- Jokers: sub for any tile in sets of 3+; NOT in pairs; NOT for Flowers
- All Flowers equivalent (F/FF/FFF = any flowers, no specific number needed)
- Points shown in UI but do NOT affect probability ranking
- Charleston: Left → Across → Right (1st), Right → Across → Left (2nd), optional Courtesy pass
