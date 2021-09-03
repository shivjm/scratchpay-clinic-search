require("dotenv-safe").config();

import { createServer } from "./server";
import { API_URL, CLINIC_FILES, DATA_CACHE_DURATION, PORT } from "./config";
import { LOGGER } from "./logger";
import { createCachedFetch, fetchData, parseData } from "./data";

const cache = createCachedFetch(API_URL, CLINIC_FILES, DATA_CACHE_DURATION);
const fetch =
  DATA_CACHE_DURATION > 0
    ? () => cache.get()
    : () => fetchData(API_URL, CLINIC_FILES);

createServer(LOGGER, async () => parseData(await fetch())).listen(PORT);
