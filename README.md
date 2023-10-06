<p align="center">
  <picture>
      <source srcset="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" media="(prefers-color-scheme: dark)">
      <img src="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" alt="Subsquid Logo">
  </picture>
</p>

# Snapshot Squid

Snapshot Squid is an implementation of the [Snapshot Subgraph](https://thegraph.com/hosted-service/subgraph/snapshot-labs/snapshot) using the [Squid SDK](https://docs.subsquid.io/), migrating the snapshot subgraph to the squid SDK. It provides a powerful and flexible way to interact with on-chain data and query information from the Ethereum blockchain.

## Prerequisites

Before getting started, ensure you have the following dependencies installed on your machine:

- [Node.js](https://nodejs.org/): JavaScript runtime for running JavaScript applications.
- [Docker](https://www.docker.com/): Used to manage containers for PostgreSQL.

## Quickstart

Follow these steps to set up and run Snapshot Squid migration on your local machine:

```bash
# 0. Install @subsquid/cli globally (the sqd command)
npm i -g @subsquid/cli

# 1. Clone the repository
git clone https://github.com/RicqCodes/snapshot-subgraph-migration.git

# 2. Navigate to the project folder
cd snapshot-squid

# 3. Rename .env.example to .env and configure environment variables

# 4. Install project dependencies
npm i

# 5. Build the project
sqd build

# 6. Start a PostgreSQL database container and detach
sqd up

# 7. Run migrations
sqd migration:generate

# 8. Start the processor
sqd process

# 9. The processor command will block the terminal while fetching chain data,
#    transforming it, and storing it in the target database.
#    To start the GraphQL server, open a separate terminal and run
sqd serve
```

A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

## Query Examples

The code includes a query named CombinedData which fetches data for delegations, blocks, and signatures.


### Squid Query

```
query CombinedData {
  delegations(limit: 5) {
    id
    delegator
    space
    delegate
  }
  blocks(limit: 2) {
    id
    number
    timestamp
  }
  sigs(limit: 2) {
    id
    account
    msgHash
    timestamp
  }
}

```

#### Output
{
  "data": {
    "delegations": [
      // Delegation data here...
    ],
    "blocks": [
      // Block data here...
    ],
    "sigs": [
      // Signature data here...
    ]
  }
}

![Snapshot Subgraph](https://github.com/cleanerzkp/snapshot-subgraph-migration/blob/main/assets/snapshot-subgraph.png)

## Graph Query

```
query CombinedData {
  delegations(limit: 5) {
    id
    delegator
    space
    delegate
  }
  blocks(limit: 2) {
    id
    number
    timestamp
  }
  sigs(limit: 2) {
    id
    account
    msgHash
    timestamp
  }
}

```

#### Output
{
  "data": {
    "delegations": [
      // Delegation data here...
    ],
    "blocks": [
      // Block data here...
    ],
    "sigs": [
      // Signature data here...
    ]
  }
}

![Snapshot Subgraph](https://github.com/cleanerzkp/snapshot-subgraph-migration/blob/main/assets/snapshot-subgraph.png)

