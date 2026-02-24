import { requestHandler } from "./src/app.js";

const main = () => {
  Deno.serve({ port: 8000 }, requestHandler);
};

main();
