// const grpc = require("@grpc/grpc-js");
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "../protos/short_links.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
console.debug(packageDefinition);

export const UrlService =
  grpc.loadPackageDefinition(packageDefinition).short_links.URL;
