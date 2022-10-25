import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { default as express } from "express";

const app = express();
const port = 3000;

import { UrlService } from "./client.js";

const client = new UrlService(
  "localhost:8080",
  grpc.credentials.createInsecure()
);

app.use(express.json());

app.get("/:path", (req, res) => {
  const path = req.params.path;

  client.ResolveShortLink({ path }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (response.url === "FAILED") {
        res.status.apply(500).send("FAILED!");
      } else {
        res.redirect(response.url);
      }
    }
  });
});

app.post("/", (req, res) => {
  const url = req.body.url;

  client.CreateShortLink({ url }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(`PATH ${response.path}`);
    }
  });
});

app.get("/graphql", (req, res) => {
  res.send("Hello from GraphQL!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
