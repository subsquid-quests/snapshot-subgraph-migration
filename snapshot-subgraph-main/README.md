
![68747470733a2f2f75706c6f6164732d73736c2e776562666c6f772e636f6d2f3633623561393935386663636564636636376437313661632f3634363632646633613561353638666439396533363030635f53717569645f506f73655f315f57686974652d7472616e73706172656e742d736c696d253230](https://github.com/davaymne/snapshot-subgraph/assets/29555611/cfb9fbce-5959-41c7-b7dd-69e8c95bf08a)

# Snapshot Subgraph

This is a starter **Snapshot Subgraph** ported from The Graph [Snapshot Subgraph](https://thegraph.com/hosted-service/subgraph/snapshot-labs/snapshot). 
See [Squid SDK docs](https://docs.subsquid.io/) for a complete reference.

## Quickstart and run locally

```bash
# 0. Install @subsquid/cli a.k.a. the sqd command globally
npm i -g @subsquid/cli

# 1. Install dependencies
npm ci

# 2. Clone current repository
git clone https://github.com/davaymne/snapshot-subgraph

# 3. Build project
sqd build

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
>> NOTE: A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

## Query Examples:

### Squid Query

 - Delegations
```
query MyQuery {
  delegations (limit:2){
    delegate
    delegator
    id
    space
    timestamp
  }
}
```
Output:
<img width="1257" alt="Screenshot 2023-10-05 at 00 44 19" src="https://github.com/davaymne/snapshot-subgraph-migration/assets/29555611/7fa470e0-16f4-4e4f-8002-160c7d858686">

 - SigMsg by account
```
query MyQuery {
  sigs(where: {account_contains: "0x00f10f0fd39533bd8567c763b2671cda00da7872"}) {
    id
    account
    msgHash
    timestamp
  }
}
```
Output:
<img width="1386" alt="Screenshot 2023-10-05 at 00 42 16" src="https://github.com/davaymne/snapshot-subgraph-migration/assets/29555611/fe09de02-e192-4b8a-8b65-a04ca5277005">


 - Multiple sigMsg in 1 x tx:
```
query MyQuery {
  sigs (where: {id_contains: "0x1e206ce100e2c9c85dbf6365798e2e6ccbf4e30d9499a00699e86531c6426778"}){
    id
    account
    timestamp
    msgHash
  }
}
```
<img width="1392" alt="Screenshot 2023-10-05 at 00 47 32" src="https://github.com/davaymne/snapshot-subgraph-migration/assets/29555611/de5fb254-e510-4579-a377-3cb74cf52724">


### The Graph Query
```
{
  delegations(first: 2) {
    id
    delegator
    space
    delegate
    timestamp
  }
}
```
Output:
<img width="1391" alt="Screenshot 2023-10-01 at 04 08 45" src="https://github.com/davaymne/snapshot-subgraph/assets/29555611/6fb73827-718a-494d-b4fb-ad807508e88d">

```
{
  sigs (where: {account: "0x00f10f0fd39533bd8567c763b2671cda00da7872"}){
    id
    account
    timestamp
    msgHash
  }
}
```
Output:
<img width="1254" alt="Screenshot 2023-10-04 at 02 04 03" src="https://github.com/davaymne/snapshot-subgraph-migration/assets/29555611/a5b457ca-d37a-4832-b73d-ab1d6505a03f">



