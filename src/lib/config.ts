// src/lib/config.ts
let config: Record<string, any> = {};
let loaded = false;

/**
 * Fetch and cache config.json on first call.
 */
export async function loadConfig() {
  if (loaded) return config;

  const res = await fetch('/config.json');
  if (!res.ok) throw new Error(`Failed to load config.json (${res.status})`);

  config = await res.json();
  loaded = true;
  return config;
}

/**
 * Return the loaded config object.
 * Throws if called before loadConfig() has run.
 */
export function getConfig() {
  if (!loaded) {
    console.warn('getConfig() called before loadConfig() finished');
  }
  return config;
}
