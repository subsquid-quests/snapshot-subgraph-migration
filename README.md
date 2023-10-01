# Snapshot Subgraph Migration by Alfonova

## Task
1.Instructions how to run the squid locally
2. Sample Squid queries and the corresponding Subgraph queries

## Prerequiste
1. Installation Subsquid
Install the latest version of Subsquid CLI

>- I use VPS Digital Ocean
```
apt update && apt upgrade && apt install npm && apt install docker-compose
```

```
npm i -g @subsquid/cli@latest
```

```
sqd --version
```

2. Install dependencies
```
npm ci
```

3. Clone Repo from github https://github.com/subsquid-quests/snapshot-subgraph-migration
   
Change "your-folder" with any name you want

```
sqd init <your-folder> --template evm
```

## Execution !!!
### Go to schema.graphql
Copy and Replace with commands below

```
type Gravatar @entity {
  id: ID!
  owner: String!
  displayName: String!
  imageUrl: String!
}
```

### Make Gravity.json
>- Go to `abi` folder and make a new file name `Gravity.json`
>- Copy command below and paste on it

```
[{"constant":false,"inputs":[{"name":"_imageUrl","type":"string"}],"name":"updateGravatarImage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"setMythicalGravatar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"getGravatar","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"gravatarToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToGravatar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_displayName","type":"string"}],"name":"updateGravatarName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_displayName","type":"string"},{"name":"_imageUrl","type":"string"}],"name":"createGravatar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"gravatars","outputs":[{"name":"owner","type":"address"},{"name":"displayName","type":"string"},{"name":"imageUrl","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"displayName","type":"string"},{"indexed":false,"name":"imageUrl","type":"string"}],"name":"NewGravatar","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"displayName","type":"string"},{"indexed":false,"name":"imageUrl","type":"string"}],"name":"UpdatedGravatar","type":"event"}]
```

# Setting processor on /src/processor.ts
>- Open `processor.ts` file on `src` folder
>- Copy and paste command below after ending .addtransaction and save it

```
.addLog({
        address: ['0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'],
    });

```
>- Execute the squid typegen command

```
sqd typegen
```
`
>-  Copy this command and replace on `processor.ts`

```
import {lookupArchive} from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'
import * as Gravatar from './abi/Gravity';
export const processor = new EvmBatchProcessor()
    .setDataSource({
        // Change the Archive endpoints for run the squid
        // against the other EVM networks
        // For a full list of supported networks and config options
        // see https://docs.subsquid.io/evm-indexing/
        archive: lookupArchive('eth-mainnet'),

        // Must be set for RPC ingestion (https://docs.subsquid.io/evm-indexing/evm-processor/)
        // OR to enable contract state queries (https://docs.subsquid.io/evm-indexing/query-state/)
        chain: 'https://rpc.ankr.com/eth',
    })
    .setFinalityConfirmation(75)
    .setFields({
        transaction: {
            from: true,
            value: true,
            hash: true,
        },
    })
    .setBlockRange({
        from: 6_000_000,
    })

    .addLog({
        address: ['0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'],
        topic0: [
            Gravatar.events.NewGravatar.topic, 
            Gravatar.events.UpdatedGravatar.topic],
    });

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
```
>- Execute the squid codegen command

```
sqd codegen
```

### Setting main.ts on /src/main.ts

>- Copy and paste commands below on main.ts

```
import { Gravatar } from './model';
import { processor } from './processor';
import * as GravatarABI from './abi/Gravity';
import { ReturnDocument } from 'typeorm';
processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const gravatars: Map<string, Gravatar> = new Map();
    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            let { idString, owner, displayName, imageUrl } = extractData(log);
            let gravatar = new Gravatar({
                id: idString,
                owner: owner,
                displayName: displayName,
                imageUrl: imageUrl,
            });
            gravatars.set(idString, gravatar);
        }
    }
    // apply vectorized transformations and aggregations


    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert([...gravatars.values()]);
});

function extractData(log: any): { 
    idString: string; 
    owner: string; 
    displayName: string; 
    imageUrl: string;
 } {
    if (log.topics[0] === GravatarABI.events.NewGravatar.topic) {
        let { id, owner, displayName, imageUrl } =
        GravatarABI.events.NewGravatar.decode(log);
        let idString = id.toString(16);
        return { idString, owner, displayName, imageUrl };
    }
    if (log.topics[0] === GravatarABI.events.UpdatedGravatar.topic) {
        let { id, owner, displayName, imageUrl } =
        GravatarABI.events.UpdatedGravatar.decode(log);
        let idString = id.toString(16);
        return { idString, owner, displayName, imageUrl };
    }
    throw new Error('Unsupported topic');
 }
```
>- Execute the squid build command
```
sqd build
```
>- Execute the squid to running docker Note : make sure you done docker-compose installation
```
sqd up
```
>- Execute the migration if all command correct
```
sqd migration:generate
```
>- Execute the squid process if there's no error found
```
sqd process
```

### After completing all subsquid step, Open new terminal and execute subsquid serve
>- On the new terminal paste this command

```
sqd serve
```

>- Open your localhost with Your IP  `http://YOUR_IP:4350/graphql`

>- Choose all requirement you want (ex. id, owner, displayName & imageUrl)

credited : Alfonova
