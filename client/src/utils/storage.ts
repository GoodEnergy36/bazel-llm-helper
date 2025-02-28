// src/utils/storage.ts
export interface Config {
  openaiKey: string;
}

const STORAGE_KEY = 'bazel-analyzer-config';

export const storage = {
  getConfig: (): Config => {
    if (typeof window === 'undefined') return { openaiKey: '' };
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { openaiKey: '' };
  },

  setConfig: (config: Partial<Config>): void => {
    if (typeof window === 'undefined') return;
    const current = storage.getConfig();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...current, ...config })
    );
  }
};