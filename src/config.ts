/* eslint-disable @typescript-eslint/no-non-null-assertion */
// all the environment variables are defined because of dotenv-safe

import { parseDecimalInteger } from "./number";

export const API_URL = process.env.API_URL!;
export const PORT = parseDecimalInteger(process.env.PORT!);

export const CLINIC_FILES = process.env.CLINIC_FILES!.split(",");

/** How long in seconds remote data should be cached before being refreshed (`0` disables caching). */
export const DATA_CACHE_DURATION = parseDecimalInteger(
  process.env.DATA_CACHE_DURATION!,
);

/** How long in seconds to wait for a remote data file to be fetched before timing out. */
export const TIMEOUT = parseDecimalInteger(process.env.TIMEOUT!);
/* eslint-enable @typescript-eslint/no-non-null-assertion */
