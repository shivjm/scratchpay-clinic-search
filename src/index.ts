require("dotenv-safe").config();

import { createServer } from "./server";
import { API_URL, CLINIC_FILES, PORT } from "./config";
import { LOGGER } from "./logger";
import { fetchData, parseData } from "./data";

createServer(LOGGER, async () =>
  parseData(await fetchData(API_URL, CLINIC_FILES)),
).listen(PORT);
