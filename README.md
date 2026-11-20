# Engine Room Records (`engineroom.raggiesoft.com`)

[![License: MIT](https://img.shields.io/badge/Code_License-MIT-0369a1.svg)](./LICENSE)
[![Stack: Astro 6 Static SSG](https://img.shields.io/badge/Framework-Astro_6_Static_SSG-ff5d01.svg)](https://engineroom.raggiesoft.com)

- **Canonical Domain**: `https://engineroom.raggiesoft.com`
- **Vanity & Legacy `301` Redirects**:
  - `https://engineroom-records.com/*` → `301` to `https://engineroom.raggiesoft.com/*`
  - `https://fracturedprisms.com/*` → `301` to `https://engineroom.raggiesoft.com/artists/fractured-prisms`
  - `https://raggiesoft.com/engine-room*` → `301` to `https://engineroom.raggiesoft.com/*`

## Overview & Core Architecture

1. **Multi-Tenant Artist Catalog (`/` & `/artists/[slug]`)**:
   Consolidates seven musical project rosters (*The Stardust Engine*, *Fractured Prisms*, *The Paper Wall*, *The Arctic Symphony Project*, *Crimson Node*, *Mana Canvas*, and *Firelight*) under one Astro 6 static codebase, linking directly to **The Listening Room** (`https://music.raggiesoft.com`) for streaming/synchronized WebVTT lyrics and **RaggieSoft Book Reader** (`https://books.raggiesoft.com`) for companion novels.
2. **US ISRC (`QTAHP`) & Studio Engineering Registries (`/isrc`, `/dsp-verification`, `/studio-engineering`)**:
   Generates static US ISRC (`QTAHP`) verification tables, commercial DSP distribution ledgers, and audio production documentation from structured JSON manifests with WCAG 2.1 AA Light/Dark theming.
3. **Real-World Imprint vs. In-Universe Lore Separation (`/corporate`)**:
   Clearly distinguishes **Engine Room Records** (the real-world unincorporated music imprint of Michael P. Ragsdale) from **Engine Room Records, LLC** (the fictitious in-universe record label founded by Holly O'Connell in 1992).

## Closed Submission Policy

**Engine Room Records** is a closed private imprint created solely for Michael P. Ragsdale's multimedia projects and does not accept outside demos or submissions.

## Licensing

- **Source Code**: MIT License (`LICENSE`)
- **Creative Content, Lore & Metadata**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) alongside applicable DSP consumer licenses and commercial synchronization clearances (`/commercial-licensing`).
