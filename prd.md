web application/stitch/projects/18071842013991626013/screens/0001df17d300497c920f654da0a1c0d1

# Spirewalker: Product Requirements Document (PRD)

## 1. Project Overview

**Spirewalker** is a high-fidelity, web-based Roguelike Deckbuilder set in a "Dark Fantasy meets Cyber-Holographic" universe. Players ascend a mysterious Spire, navigating a shifting map of magical projections, battling corrupted sentinels, and collecting ancient relics to manifest their fate.

### 1.1 Core Pillar: "The Ethereal Void"

The game’s identity is defined by a heavy atmospheric contrast: the weight of ancient, gothic architecture ("The Spire") meeting the ephemeral, glowing logic of a digital/magical projection.

---

## 2. Visual & Brand Identity

- **Aesthetic**: Dark Fantasy / Cyber-Gothic / Holographic.
- **Color Palette**:
  - Primary: Obsidian Black (`#131314`)
  - Accent: Void Purple (`#8B5CF6`)
  - Highlight: Legendary Gold / Amber
  - UI Element: Ethereal Cyan (for tactical projections)
- **Typography**: _Libre Caslon Text_ (Serif) for narrative and headers; high-readability Sans-serif for tactical data.
- **Key Visual Motifs**: Scanlines, void energy particles, hovering holographic UI elements, and ancient stone textures.

---

## 3. Core Gameplay Systems

### 3.1 Tactical Combat Interface

- **Grid-Based Layout**: 16:9 optimized for desktop.
- **Hierarchy of Information**:
  1. Enemy Intent (Top priority icons)
  2. Player/Enemy Health & Armor (High-contrast bars)
  3. Hand Management (Centered bottom, 25% larger cards)
  4. Energy/Resources (Pronounced glowing orb)
- **Card Interaction**: Digital cards with "Golden Pass" style laser-foil effects and rare holographic rarity tiers.
- **Status Management**: Dedicated buff/debuff areas with hover-tooltips for tactical depth.

### 3.2 Strategic Void Map

- **Celestial Projection**: Designed as an ancient star chart projected in 3D space.
- **Node Topology**: Clear logical branching between:
  - Combat / Elite Threats
  - Void Anomalies (Events)
  - Relic Traders (Shop)
  - Aether Rests
- **Pathing**: High-visibility "Void Veins" indicating available routes and future tactical planning.

### 3.3 Progression & Meta-Systems

- **The Forbidden Archive (Codex)**: An immersive encyclopedia of encountered entities, relics, and lore.
- **The Grand Exhibition Hall (Collection)**: A "Museum-style" display for unlocked cards and relics, using silhouettes for unearned items to drive completionism.
- **Fate Alignment (New Run)**: A structured three-step onboarding:
  1. Select Soul Archetype (Character class)
  2. Choose Starting Deck
  3. Sign Covenant Banner (Run modifiers)

---

## 4. Technical Specifications

- **Platform**: Desktop Web (16:9 Aspect Ratio).
- **Technology Stack**: React (UI Layer) + Phaser (Game Engine/Animations).
- **Performance Goal**: Seamless 60FPS transitions between UI layers and combat animations.
- **Asset Logic**: SVGs for geometric UI; high-fidelity raster assets for character/relic art.

---

## 5. User Journey Map

1.  **Awakening**: Player starts a "New Run," selecting their Archetype.
2.  **Navigation**: Player consults the "Void Map" to choose their first path.
3.  **Conflict**: Combat encounter ensues. Player uses card logic to defeat the Sentinel.
4.  **Reward**: Victory screen offers card rewards, gold, and potential relics.
5.  **Mastery**: Between runs, the player browses the "Collection" and "Achievements" to track their ascent.

---

## 6. Design Constraints & Rules

- **Anti-Patterns**: No "Standard Management" UI, no Excel-style lists, no flat e-commerce shop designs.
- **沉浸感 (Immersion)**: Every screen must feel like a physical interface within the game world (a "Forbidden Tool").
- **Legibility**: Despite the dark aesthetic, tactical numbers and intents must be readable within 3 seconds.
