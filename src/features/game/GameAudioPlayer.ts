import { logError } from "../../shared/logger/LoggerService";
import type { GameAudioCue } from "./GameAudioCueService";
import type { GameStatus } from "./Game.types";

export type AudioPreferences = Readonly<{
  musicEnabled: boolean;
  effectsEnabled: boolean;
}>;

export interface GameAudioPlayer {
  dispose(): void;
  play(cues: ReadonlyArray<GameAudioCue>): void;
  setPreferences(preferences: AudioPreferences): void;
  syncMusic(status: GameStatus): void;
  unlock(): void;
}

const AUDIO_SOURCE_BY_CUE: Readonly<Record<GameAudioCue, string>> = {
  start: "/audio/game-start.ogg",
  "food-eaten": "/audio/food-eaten.ogg",
  "level-up": "/audio/level-up.ogg",
  "life-lost": "/audio/life-lost.ogg",
  "game-over": "/audio/game-over.ogg",
  victory: "/audio/victory.ogg",
};

const MUSIC_SOURCE = "/audio/slampe.ogg";

function createAudio(source: string, loop = false): HTMLAudioElement {
  const audio = new Audio(source);
  audio.loop = loop;
  audio.preload = "auto";
  return audio;
}

function reportPlaybackFailure(
  source: string,
  error: unknown,
  reportedFailureSources: Set<string>,
): void {
  if (reportedFailureSources.has(source)) {
    return;
  }

  reportedFailureSources.add(source);
  logError("Unable to play game audio.", error, { source });
}

function restartAndPlay(
  audio: HTMLAudioElement,
  source: string,
  reportedFailureSources: Set<string>,
): void {
  audio.currentTime = 0;
  play(audio, source, reportedFailureSources);
}

function play(
  audio: HTMLAudioElement,
  source: string,
  reportedFailureSources: Set<string>,
  onFailure?: () => void,
): void {
  const playback = audio.play();

  if (playback !== undefined) {
    void playback.catch((error: unknown) => {
      reportPlaybackFailure(source, error, reportedFailureSources);
      onFailure?.();
    });
  }
}

function prime(audio: HTMLAudioElement): void {
  audio.muted = true;
  const playback = audio.play();

  if (playback === undefined) {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    return;
  }

  void playback.then(
    () => {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
    },
    () => {
      audio.muted = false;
    },
  );
}

export function createGameAudioPlayer(): GameAudioPlayer {
  const music = createAudio(MUSIC_SOURCE, true);
  const effects = Object.fromEntries(
    Object.entries(AUDIO_SOURCE_BY_CUE).map(([cue, source]) => [
      cue,
      createAudio(source),
    ]),
  ) as Record<GameAudioCue, HTMLAudioElement>;
  let preferences: AudioPreferences = {
    musicEnabled: true,
    effectsEnabled: true,
  };
  let musicIsActive = false;
  const reportedFailureSources = new Set<string>();

  return {
    dispose(): void {
      music.pause();
      music.currentTime = 0;
      Object.values(effects).forEach((effect) => {
        effect.pause();
        effect.currentTime = 0;
      });
    },
    play(cues: ReadonlyArray<GameAudioCue>): void {
      if (!preferences.effectsEnabled) {
        return;
      }

      cues.forEach((cue) =>
        restartAndPlay(effects[cue], effects[cue].src, reportedFailureSources),
      );
    },
    setPreferences(nextPreferences: AudioPreferences): void {
      preferences = nextPreferences;

      if (!preferences.musicEnabled) {
        music.pause();
        musicIsActive = false;
      }

      if (!preferences.effectsEnabled) {
        Object.values(effects).forEach((effect) => effect.pause());
      }
    },
    syncMusic(status: GameStatus): void {
      if (status === "active" && preferences.musicEnabled && !musicIsActive) {
        play(music, MUSIC_SOURCE, reportedFailureSources, () => {
          musicIsActive = false;
        });
        musicIsActive = true;
        return;
      }

      if (status !== "active" || !preferences.musicEnabled) {
        music.pause();
        musicIsActive = false;
      }

      if (status === "game-over" || status === "completed") {
        music.currentTime = 0;
      }
    },
    unlock(): void {
      [music, ...Object.values(effects)].forEach(prime);
    },
  };
}
