# Hardcoded Episode 0.1

## Mission

URL Shortener with static and dynamic configuration

## Constraints

1. gRPC
2. GraphQL
3. Serverless

### Canned

1. Event Driven
2. WASM

## Design

- Dynamic Paths = HTTP Server -> gRPC -> URL Service --> SQLite
- Static Paths  = HTTP Server -> gRPC -> URL Service
- GraphQL API   = HTTP Server -> GraphQL -> URL Service -> SQLIte

### Schema

```sql
CREATE TABLE links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    url TEXT NOT NULL,
    UNIQUE (path)
);
```

```protoc
syntax = "proto3";

package url;

service URL {
  rpc GetURL (GetURLRequest) returns (GetURLResponse) {}
  rpc SetURL (SetURLRequest) returns (SetURLResponse) {}
}

message GetURLRequest {
  string path = 1;
}

message GetURLResponse {
  string url = 1;
}

message SetURLRequest {
  string path = 1;
  string url = 2;
}

message SetURLResponse {
  string path = 1;
  string url = 2;
}
```

## Implementation

- HTTP Server - Express
- URL Service - Go / Tonic
- GraphQL Service - Express gQL


## Tests

- K6s
  - HTTP GraphQL Mutation with createShortLink(long: "https://") -> string
  - HTTP GET /{shortLink} -> 302
  - HTTP GET /{static} -> 302
  - HTTP GET /{unknown} -> 404
