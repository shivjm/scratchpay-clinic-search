/* eslint-disable @typescript-eslint/no-non-null-assertion */
// all the environment variables are defined because of dotenv-safe

export const API_URL = process.env.API_URL!;
export const PORT = parseInt(process.env.PORT!, 10);

export const CLINIC_FILES = process.env.CLINIC_FILES!.split(",");

/** How long in seconds remote data should be cached before being refreshed (`0` disables caching). */
export const DATA_CACHE_DURATION = parseInt(
  process.env.DATA_CACHE_DURATION!,
  10,
);

/** How long in seconds to wait for a remote data file to be fetched before timing out. */
export const TIMEOUT = parseInt(process.env.TIMEOUT!, 10);
/* eslint-enable @typescript-eslint/no-non-null-assertion */
