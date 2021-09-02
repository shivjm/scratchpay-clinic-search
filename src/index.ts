require("dotenv-safe").config();

import { createServer } from "./server";
import { PORT } from "./config";
import { LOGGER } from "./logger";

createServer(LOGGER).listen(PORT);
