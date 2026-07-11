# Music Asset Research

## Scope

Shortlist free, publish-safe background music for Neon Snake: modern, energetic electronic / ambient instrumental music. The preferred implementation target is a loopable track of roughly one to three minutes.

## License standard

The primary shortlist uses **CC0** assets from OpenGameArt. CC0 dedicates a work to the public domain to the fullest extent permitted by law, so commercial use and attribution-free use are allowed. This is a better fit than a stock-library license for a bundled game asset because it does not create a Content ID or attribution workflow.

The alternatives from Pixabay are also commercially usable without attribution: Pixabay grants a royalty-free right to use non-CC0 content for commercial or non-commercial purposes, while disallowing standalone redistribution; it also says attribution is not required. However, several candidate pages are Content ID registered, so retain the download record and expect possible platform-claim administration if the game is distributed with promotional video. [Pixabay Terms, sections 5–6](https://pixabay.com/service/terms/) · [Pixabay license summary](https://pixabay.com/service/license-summary/)

## Primary shortlist — CC0

| Track                                                                                                                      | Fit                                                                                                                  | Loop / duration status                                                                                                                                           | License evidence                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [Uptempo atmospheric electronic tune — obscure music](https://opengameart.org/content/uptempo-atmospheric-electronic-tune) | **Best starting candidate.** The official tags are uptempo, techno, ambient, electronic, atmospheric, and 140 BPM.   | The page provides an MP3 but does **not** claim a seamless loop; a page comment asks for a loopable version. Audition its ending before selection.               | The page labels it CC0 and explicitly says it is released under public domain.                                   |
| [Slampe – Synthwave House — Fupi](https://opengameart.org/content/slampe-synthwave-house)                                  | Strong energetic electronic alternative: synthwave / house at 114 BPM, with synth and bass.                          | The author says the track was made from previously posted loops; the supplied full track still needs an in-game loop-boundary audition. WAV and OGG are offered. | The page labels it CC0.                                                                                          |
| [Space Synth Wave — Pro Sensory](https://opengameart.org/content/space-synth-wave)                                         | Upbeat electronic/synthwave with space, battle, cyberpunk, and tech framing; a natural visual fit for the neon game. | WAV only; duration and loop seam are not published on the page, so evaluate before committing.                                                                   | The page labels it CC0, and the author says attribution is not mandatory.                                        |
| [Chromatic Electronic — Pro Sensory](https://opengameart.org/content/chromatic-electronic)                                 | More ambient/chiptune-leaning electronic option if the first three are too intense.                                  | MP3 only; no published duration or loop declaration.                                                                                                             | The page labels it CC0, calls the music public domain, and says attribution is appreciated rather than required. |
| [Rain Drops — SpringySpringo](https://opengameart.org/content/rain-drops)                                                  | Ambient electronic with piano and synths; suitable when a lower-energy option is preferred.                          | MP3 and WAV; duration and loop seam must be checked.                                                                                                             | The page offers CC0 (as well as CC-BY 3.0) and explicitly says credit is not required. Choose the CC0 option.    |
| [Life in corrupted binary — HaelDB](https://opengameart.org/content/life-corrupted-binary)                                 | Downtempo glitch / ambient / electronic / instrumental fallback, with a sci-fi tone.                                 | FLAC only; no published duration or loop declaration.                                                                                                            | The page lists CC0 as an available license (alongside OGA-BY 3.0). Choose the CC0 option.                        |

## Selected candidate

**Slampe – Synthwave House** is the selected music candidate. It is CC0 and offers WAV and OGG files; use the OGG version for the browser build unless a later compatibility check requires another format.

### Asset record

- Local file: `public/audio/slampe.ogg`
- Original download: <https://opengameart.org/sites/default/files/slampe_0.ogg>
- Source page: <https://opengameart.org/content/slampe-synthwave-house>
- License: CC0, shown on the source page.
- Format: Ogg Vorbis, stereo, 44.1 kHz.
- SHA-256: `9953b5f9a16c7a6b54d6ed2bea662006997b43a6946b269b7023c7c9d6929853`

## Recommendation and selection gate

The selected track is **Slampe – Synthwave House**. Its full track still needs an in-game loop-boundary audition before it is added to the game. **Uptempo atmospheric electronic tune** remains the fallback if the loop seam or final mix is unsuitable.

Before adding any track to the game:

1. Download the original file and save its source URL and license in the asset record.
2. Listen to the join from the final ~5 seconds back to the start at gameplay volume. “CC0” does not imply a seamless loop.
3. If there is a hard ending, either choose another track or create a short, documented crossfade/loop edit from the CC0 original.
4. Keep music quieter than gameplay effects, and test in the target browser.

## Excluded candidate

[Loop — symphony](https://opengameart.org/content/loop) is explicitly named as a loop and is CC0, but its author asks users to leave credit. CC0 legally allows attribution-free use; nevertheless it is excluded from the preferred set to honor the contributor’s stated request.

## Source notes

All track metadata and license descriptions above are from the linked official OpenGameArt asset pages, checked on 2026-07-11. This is an asset-selection note, not legal advice.
