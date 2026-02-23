import { requestHandler } from "./src/app.js";

Deno.serve({ port: 8000 }, requestHandler);
