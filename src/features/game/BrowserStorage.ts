import type { KeyValueStorage } from "./JsonStorage";

export const BROWSER_STORAGE: KeyValueStorage = {
  getItem(key): string | null {
    return window.localStorage.getItem(key);
  },
  setItem(key, value): void {
    window.localStorage.setItem(key, value);
  },
};
