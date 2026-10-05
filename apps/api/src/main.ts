import { createServer } from "node:http";
import { config } from "./config.js";
import { closeDatabase, initialiseDatabase } from "./database.js";

async function bootstrap(): Promise<void> {
  await initialiseDatabase();

  const server = createServer((req, res) => {
    if (req.url === "/health" && req.method === "GET") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "abc-api" }));
      return;
    }
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  server.listen(config.port, () => console.log(`ABC API listening on port ${config.port}`));

  const shutdown = async () => {
    server.close();
    await closeDatabase();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  console.error("Failed to start ABC API", error);
  process.exit(1);
});
