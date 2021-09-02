import { createServer } from "./server";
require("dotenv-safe").config();
import { PORT } from "./config";

createServer().listen(PORT);
