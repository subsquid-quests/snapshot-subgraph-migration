# `KeyvAdapter` class

The `KeyvAdapter` class is a simple wrapper for `Keyv` which implements the `KeyValueCache` interface from the `@apollo/utils.keyvaluecache` package. This class is intended for use by (but not limited to) Apollo Server's cache. `Keyv` supports a number of useful adapters like Redis, Mongo, SQLite, etc.

## Usage

Here's an example of using a Redis store for your ApolloServer cache:

Install the necessary packages:

```bash
npm install @apollo/utils.keyvadapter keyv @keyv/redis
```

In Apollo Server v3:

```ts
import { ApolloServer } from "apollo-server";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import Keyv from "keyv";

new ApolloServer({
  cache: new KeyvAdapter(new Keyv("redis://...")),
});
```

In Apollo Server v4:

```ts
import { ApolloServer } from "@apollo/server";
import { KeyvAdapter } from "@apollo/utils.keyvadapter";
import Keyv from "keyv";

new ApolloServer({
  cache: new KeyvAdapter(new Keyv("redis://...")),
});
```

## Options

### disableBatchReads <boolean>

By default, `KeyvAdapter` will use [`DataLoader`'s batching functionality](https://github.com/graphql/dataloader#batching) in order to request a list of keys when possible.

- If your `Keyv.store` implements `getMany`, this will be called with the list of keys aggregated by `DataLoader`.
- If your `Keyv.store` does not implement `getMany`, `get` will be called in parallel for each key (awaiting a `Promise.all()`).

`Redis.Cluster` from `ioredis` does not support `mget` (and thus, `store.getMany` is broken in this case), so batching should be disabled like so:

```ts
new ApolloServer({
  cache: new KeyvAdapter(new Keyv("redis://..."), { disableBatchReads: true }),
});
```
