import { describe, expect, it, vi } from "vitest";

import { createAudioPreferencesStorage } from "../AudioPreferencesStorage";

describe("AudioPreferencesStorage", () => {
  describe("createAudioPreferencesStorage", () => {
    it("uses enabled defaults when no preferences are stored", () => {
      const storage = createAudioPreferencesStorage(
        { getItem: () => null, setItem: vi.fn() },
        vi.fn(),
      );

      expect(storage.load()).toEqual({
        effectsEnabled: true,
        musicEnabled: true,
      });
    });

    it("returns preferences previously saved in browser storage", () => {
      const browserStorage = window.localStorage;
      const reportError = vi.fn();
      const storage = createAudioPreferencesStorage(
        browserStorage,
        reportError,
      );
      const preferences = { effectsEnabled: false, musicEnabled: true };

      storage.save(preferences);

      expect(storage.load()).toEqual(preferences);
      expect(reportError).not.toHaveBeenCalled();
    });

    it("uses defaults and reports invalid stored preferences only once", () => {
      const reportError = vi.fn();
      const storage = createAudioPreferencesStorage(
        { getItem: () => "{", setItem: vi.fn() },
        reportError,
      );

      expect(storage.load()).toEqual({
        effectsEnabled: true,
        musicEnabled: true,
      });
      expect(storage.load()).toEqual({
        effectsEnabled: true,
        musicEnabled: true,
      });
      expect(reportError).toHaveBeenCalledOnce();
      expect(reportError).toHaveBeenCalledWith(
        "Unable to load audio preferences.",
        expect.any(SyntaxError),
      );
    });

    it("uses defaults when stored preference fields are invalid", () => {
      const reportError = vi.fn();
      const storage = createAudioPreferencesStorage(
        {
          getItem: () => JSON.stringify({ musicEnabled: "yes" }),
          setItem: vi.fn(),
        },
        reportError,
      );

      expect(storage.load()).toEqual({
        effectsEnabled: true,
        musicEnabled: true,
      });
      expect(reportError).not.toHaveBeenCalled();
    });

    it("reports a browser write failure only once without throwing", () => {
      const writeError = new Error("Storage unavailable");
      const reportError = vi.fn();
      const storage = createAudioPreferencesStorage(
        {
          getItem: () => null,
          setItem: () => {
            throw writeError;
          },
        },
        reportError,
      );
      const preferences = { effectsEnabled: false, musicEnabled: true };

      expect(() => storage.save(preferences)).not.toThrow();
      expect(() => storage.save(preferences)).not.toThrow();
      expect(reportError).toHaveBeenCalledOnce();
      expect(reportError).toHaveBeenCalledWith(
        "Unable to save audio preferences.",
        writeError,
      );
    });
  });
});
