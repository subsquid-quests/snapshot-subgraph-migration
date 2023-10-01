# Snapshot Subgraph Migration by Logosdibta


## Task

1. Instructions how to run the squid locally
2. Sample Squid queries and the corresponding Subgraph queries

## Prerequiste

### 1. Installation Subsquid
Install the latest version of Subsquid CLI
```
npm i -g @subsquid/cli@latest 
```
```
sqd --version
```

### 2. Install dependencies
```
npm ci
```

### 3. Clone Repo from github
Change "your-folder" with any name you want
```
sqd init <your-folder> --template evm                              
```

### 4. Install docker-compose
a. Go to https://www.docker.com/products/docker-desktop <br>
b. Downloads and Install <br>
c. After success you can verify installation 
```
docker --version
```

## Execution !!!

### 1. Go to schema.graphql
Copy and Replace with commands below
```
type Gravatar @entity {
  id: ID!
  owner: String!
  displayName: String!
  imageUrl: String!
}
```

### 2. Make Gravity.json
a. Go to "abi" folder and make a new file name "Gravity.json" <br>
b. Copy command below and paste on it <br>
Note : if you want more easy to read the command press 'Shift+Alt+F'
```
[{"constant":false,"inputs":[{"name":"_imageUrl","type":"string"}],"name":"updateGravatarImage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"setMythicalGravatar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"getGravatar","outputs":[{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"gravatarToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerToGravatar","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_displayName","type":"string"}],"name":"updateGravatarName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_displayName","type":"string"},{"name":"_imageUrl","type":"string"}],"name":"createGravatar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"gravatars","outputs":[{"name":"owner","type":"address"},{"name":"displayName","type":"string"},{"name":"imageUrl","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"displayName","type":"string"},{"indexed":false,"name":"imageUrl","type":"string"}],"name":"NewGravatar","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"displayName","type":"string"},{"indexed":false,"name":"imageUrl","type":"string"}],"name":"UpdatedGravatar","type":"event"}]
```

### 3. Setting processor on /src/processor.ts
a. Open "processor.ts" file on "src" folder <br>
b. Copy and paste command below after ending .addtransaction and save it
```
.addLog({
        address: ['0x2E645469f354BB4F5c8a05B3b30A929361cf77eC'],
    });
```
<img width="289" alt="image" src="https://github.com/Logosdibta/snapshot-subgraph-migration/assets/97156724/6beff3c6-e7e5-4186-9d79-71e2682787f8">

c. Execute the squid typegen command
```
sqd typegen
```
<img width="266" alt="image" src="https://github.com/Logosdibta/snapshot-subgraph-migration/assets/97156724/983ebce4-3f04-4168-a0d1-36a4a548f29f">

d. Copy this command and replace on processor.ts
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

e. Execute the squid codegen command
```
sqd codegen
```

### 4. Setting main.ts on /src/main.ts
a. Copy and paste commands below on main.ts
```import { TypeormDatabase } from '@subsquid/typeorm-store';
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
b. Execute the squid build command
```
sqd build
```
c. Execute the squid to running docker
Note : make sure you done docker-compose installation
```
sqd up
```
d. Execute the migration if all command correct
```
sqd migration:generate
```
e. Execute the squid process if there's no error found
```
sqd process
```

### 5. After completing all subsquid step, Open new terminal and execute subsquid serve
a. On the new terminal paste this command
```
sqd serve
```
b. Open your localhost http://localhost:4350/graphql
c. Choose all requirement you want (ex. id, owner, displayName & imageUrl)
<img width="960" alt="image" src="https://github.com/Logosdibta/snapshot-subgraph-migration/assets/97156724/47d8d486-1b7b-482b-a5bd-61dcd48d5053">

<center>
  credited : Logosnodos
</center>

