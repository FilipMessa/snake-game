# Sound-effect asset research

Research date: 2026-07-11

## Acceptance criteria

- Coherent electronic, synth, or arcade palette that fits the neon game.
- Free for commercial use with no attribution requirement.
- One pack should cover: start/resume, food collect, level-up, life loss, game over, and victory.
- Control toggles and food spawning remain silent by design.

## Recommended pack

### 50 CC0 retro / synth SFX — rubberduck

- Source: <https://opengameart.org/content/50-cc0-retro-synth-sfx>
- License: CC0, as listed on the publisher page; no attribution is required.
- Download: one 1.9 MB ZIP archive containing 50 effects, plus LMMS source files.
- Why it fits: it was made with synthesizers and explicitly includes coin, power-up, death/die, explosion, beep, laser, and miscellaneous effects. That maps directly to the agreed event plan without mixing asset libraries.

| Game event     | Local file                    | Original pack file       | SHA-256                                                            |
| -------------- | ----------------------------- | ------------------------ | ------------------------------------------------------------------ |
| Start / resume | `public/audio/game-start.ogg` | `synth_beep_03.ogg`      | `e4a0dd2d8c3f4b8d02dd43774e1621ec4282398c7f14dabc2759e98e3390ce86` |
| Food eaten     | `public/audio/food-eaten.ogg` | `retro_coin_02.ogg`      | `7dcacaf398772c7a81b89f591442ae5aed6a9fbb975b923ecfaa6822fa9e93ce` |
| Speed level-up | `public/audio/level-up.ogg`   | `power_up_06.ogg`        | `2e7ccca1d85245dfb55e090830a5a7200777fb0f64d9031015bb35f642135b99` |
| Life loss      | `public/audio/life-lost.ogg`  | `retro_die_02.ogg`       | `5b5833a148ed8262b3a6f0c6a701c9955d7d3c558b4c398994b6f7d846d59c9d` |
| Game over      | `public/audio/game-over.ogg`  | `retro_explosion_05.ogg` | `274f80dcc29c0517f02dfbefde6335e5fea2b4a928cbaddd47886623af240fda` |
| Victory        | `public/audio/victory.ogg`    | `power_up_05.ogg`        | `4383207e829c29d055d6684eebd63d223a187000b5034fa65c2e6c4878711519` |

These candidates are selected by their pack categories; audition them in the browser with Slampe before finalizing the mix. Replace an individual file from the same pack if it is not sufficiently distinct in play.

## Fallback packs

### 50 CC0 Sci-Fi SFX — rubberduck

- Source: <https://opengameart.org/content/50-cc0-sci-fi-sfx>
- License: CC0.
- Contents: beeps, retro beeps, explosions, lasers, teleports, terminal sounds, and miscellaneous effects.
- Use only if the recommended pack lacks a sufficiently distinct start, failure, or victory sound.

### Atmospheric Interaction Sound Pack — legoluft / qubodup

- Source: <https://opengameart.org/content/atmospheric-interaction-sound-pack>
- License: CC0.
- Contents: 43 stereo WAV effects tagged with positive, negative, chimes, hit, warning, beep, bleep, laser, and smash.
- Use only for a missing high-contrast outcome cue. Its broader, more atmospheric tone may not match the selected retro-synth pack as closely.

### Interface Sounds — Kenney

- Source: <https://kenney.nl/assets/interface-sounds>
- License: CC0.
- Contents: 100 interface sounds.
- Not recommended for the initial event map: controls are intentionally silent, and this pack does not provide the distinct gameplay outcome cues as directly as the recommended pack.

## Selection and provenance gate

1. Download only the recommended ZIP first.
2. Audition candidate clips against the selected Slampe music at gameplay volume.
3. Name the six selected files by event, retain only those files in `public/audio/`, and preserve this source page and CC0 license record.
4. If a needed event is not distinct enough, use at most one clip from a fallback pack and record the source alongside it.

All licensing and pack descriptions above are from the linked publisher pages. This note is an asset-selection record, not legal advice.
