# American Mahjong Trainer

A single-player web app for learning and practicing American Mahjong (NMJL style). The player competes against 3 virtual players and uses the app to develop hand recognition, passing strategy, and tile selection skills.

## Purpose

This is a **learning tool**, not a multiplayer game. The goal is to help a player:
- Recognize NMJL card hands and understand which hands their tiles can build toward
- Learn passing strategy — which tiles to give away and which to keep during the Charleston
- Understand how their hand changes after each pass, and re-evaluate their best options

## What It Does

- **1 human player + 3 virtual (auto) players** — the other 3 players pass and draw automatically
- **Full Charleston** — Left → Across → Right (first Charleston), Right → Across → Left (second), optional Courtesy pass
- **Pass advisor** — suggests which 3 tiles to pass, based on hand probability toward NMJL 2026 card hands
- **Hand matcher** — checks tiles against all NMJL 2026 card hands to show what you can make
- **Hint button** — shows top 3 hands by probability (future paywall feature)
- **Other players' hands hidden** — realistic game simulation
- **NMJL 2026 card** — full hand definitions built in

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- localStorage for MVP persistence
- Client-side only — no backend

## Deployment

Vercel (MVP). No auth required for MVP.

## Roadmap

- **Phase 1 (MVP):** Full game loop, Charleston, pass advisor, hand matching, hint button — client-side only
- **Phase 2:** Auth (Clerk or Auth0)
- **Phase 3:** Subscription + Stripe (gates hint feature)
