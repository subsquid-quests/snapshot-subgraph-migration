<p align="center">
<picture>
    <source srcset="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" media="(prefers-color-scheme: dark)">
    <img src="https://uploads-ssl.webflow.com/63b5a9958fccedcf67d716ac/64662df3a5a568fd99e3600c_Squid_Pose_1_White-transparent-slim%201.png" alt="Subsquid Logo">
</picture>
</p>

# Snapshot Squid
The implementation [Snapshot Subgraph](https://thegraph.com/hosted-service/subgraph/snapshot-labs/snapshot) with [Squid SDK](https://docs.subsquid.io/).
Dependencies: Node.js, Docker.

## Quickstart

```bash
# 0. Install @subsquid/cli a.k.a. the sqd command globally
npm i -g @subsquid/cli

# 1. Clone repository
git clone https://github.com/0xNomind/snapshot-squid.git

# 2. Go to folder
cd snapshot-squid

# 3. Rename .env.example to .env

# 3. Install dependencies
npm ci

# 4. Start a Postgres database container and detach
sqd up

# 5. Build and start the processor
sqd process

# 6. The command above will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
sqd serve
```
A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

## Query Examples
### Squid Query
```
query MyQuery {
 delegations(limit: 5) {
    id
    delegator
    space
    delegate
  }
  blocks(limit: 5) {
    id
    number
    timestamp
  }
}
```
#### Output
![Screenshot from 2023-10-02 00-41-39](https://github.com/0xNomind/snapshot-squid/assets/140236074/b02b0a50-00c7-442b-8e64-8ecea8fa8ad5)

## Graph Query
```
{
  delegations(first: 5) {
    id
    delegator
    space
    delegate
  }
  blocks(first: 5) {
    id
    number
    timestamp
  }
}
```
#### Output
![Screenshot from 2023-10-02 00-46-42](https://github.com/0xNomind/snapshot-squid/assets/140236074/5c3a4505-de51-4041-b504-56743b792dcf)

