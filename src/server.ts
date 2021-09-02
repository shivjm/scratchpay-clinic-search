import express from "express";

export function createServer() {
  const app = express();

  app.get("/", (_req, res) => {
    res.send("OK");
  });

  return app;
}
