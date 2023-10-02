"use strict";
// import { TypeormDatabase } from "@subsquid/typeorm-store";
// import { Delegation, Sig, Block } from "./model";
// import { CONTRACT_ADDRESS_DELEGATE, processor } from "./processor";
// import { decodeHex, toHex } from "@subsquid/evm-processor";
// import * as DelegateRegistry from "./abi/DelegateRegistry";
// import * as GnosisSafe from "./abi/GnosisSafe";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// // Create a function to process logs and return data
// function getDataFromLogs(log: any) {
//   // Define a mapping of event topics to event decoding functions
//   const eventDecoders = {
//     [DelegateRegistry.events.SetDelegate.topic]: () => {
//       const { delegator, id, delegate } =
//         DelegateRegistry.events.SetDelegate.decode(log);
//       return {
//         type: "SetDelegate",
//         blockNumber: log.blockNumber,
//         block: log.block,
//         id: `${delegator}-${id}-${delegate}`,
//         delegate: decodeHex(delegate),
//         delegator: decodeHex(delegator),
//         space: id,
//         timestamp: log.block.timestamp / 1000, // Convert timestamp to seconds
//       };
//     },
//     [DelegateRegistry.events.ClearDelegate.topic]: () => {
//       const { delegator, id, delegate } =
//         DelegateRegistry.events.ClearDelegate.decode(log);
//       return {
//         type: "ClearDelegate",
//         id: `${delegator}-${id}-${delegate}`,
//         blockNumber: log.blockNumber,
//         delegate: decodeHex(delegate),
//         delegator: decodeHex(delegator),
//         space: id,
//         timestamp: log.block.timestamp / 1000, // Convert timestamp to seconds
//       };
//     },
//     [GnosisSafe.events.SignMsg.topic]: () => {
//       const { msgHash } = GnosisSafe.events.SignMsg.decode(log);
//       return {
//         type: "SignMsg",
//         id: log.transaction?.hash,
//         blockNumber: log.blockNumber,
//         block: log.block,
//         msgHash,
//         delegator: decodeHex(log.address),
//         timestamp: BigInt(log.block.timestamp / 1000), // Convert timestamp to seconds
//       };
//     },
//   };
//   const eventDecoder = eventDecoders[log.topics[0]];
//   if (eventDecoder) {
//     return eventDecoder();
//   }
//   return undefined; // Return undefined if no matching event is found
// }
// async function addBlockToDatabase(ctx: any, block: any) {
//   console.log(block.hash);
//   await ctx.store.insert(
//     new Block({
//       id: block.hash, // Use block hash as the ID
//       number: BigInt(block.height),
//       timestamp: BigInt(block.timestamp / 1000), // converted to seconds
//     })
//   );
// }
// // Main processing logic
// processor.run(
//   new TypeormDatabase({ supportHotBlocks: true }),
//   async (ctx: {
//     blocks: any[];
//     store: {
//       remove: (arg0: typeof Delegation, arg1: any[]) => any;
//       upsert: (arg0: any[]) => any;
//     };
//   }) => {
//     const delegations = new Map();
//     const sigs = new Map();
//     const clearDelegations = [];
//     const batchedLogs = ctx.blocks.flatMap(
//       (block: { logs: any }) => block.logs
//     );
//     const batchedLogsByContract = batchedLogs.reduce(
//       (
//         logsByContract: { [x: string]: any[] },
//         log: { address: string | number }
//       ) => {
//         if (!logsByContract[log.address]) {
//           logsByContract[log.address] = [];
//         }
//         logsByContract[log.address].push(log);
//         return logsByContract;
//       },
//       {}
//     );
//     // Batch processing logs for each contract
//     for (const [contractAddress, logs] of Object.entries(
//       batchedLogsByContract
//     )) {
//       // Get data from logs
//       const results = (logs as any[])
//         .map(getDataFromLogs)
//         .filter((result) => result !== undefined) as (
//         | {
//             type: "SetDelegate" | "ClearDelegate";
//             id: string;
//             delegate: Buffer;
//             delegator: Buffer;
//             space: string;
//             timestamp: number;
//           }
//         | {
//             type: "SignMsg";
//             id: any;
//             msgHash: string;
//             delegator: Buffer;
//             timestamp: bigint;
//           }
//       )[];
//       for (const result of results) {
//         if (contractAddress === CONTRACT_ADDRESS_DELEGATE) {
//           if (result.type === "ClearDelegate") {
//             // Handle ClearDelegate event
//             clearDelegations.push(result.id); // Add ID to list of delegations to clear
//           } else {
//             const setDelegateResult = result as {
//               type: "SetDelegate";
//               id: string;
//               delegate: Buffer;
//               delegator: Buffer;
//               space: string;
//               blockNumber: number;
//               block: any;
//               timestamp: number;
//             };
//             // Handle SetDelegate event
//             delegations.set(
//               setDelegateResult.id,
//               new Delegation({
//                 id: setDelegateResult.id,
//                 delegate: setDelegateResult.delegate,
//                 delegator: setDelegateResult.delegator,
//                 space: setDelegateResult.space,
//                 timestamp: setDelegateResult.timestamp,
//               })
//             );
//             await addBlockToDatabase(ctx, setDelegateResult.block);
//           }
//         } else {
//           // Process as Sig
//           const signMsgResult = result as {
//             type: "SignMsg";
//             id: any;
//             msgHash: string;
//             delegator: Buffer;
//             blockNumber: number;
//             block: any;
//             timestamp: bigint;
//           };
//           sigs.set(
//             signMsgResult.id,
//             new Sig({
//               id: signMsgResult.id,
//               account: signMsgResult.delegator,
//               msgHash: signMsgResult.msgHash,
//               timestamp: signMsgResult.timestamp,
//             })
//           );
//           await addBlockToDatabase(ctx, signMsgResult.block);
//         }
//       }
//     }
//     console.log(delegations);
//     // Remove delegations if ClearDelegate events were detected
//     if (clearDelegations.length !== 0) {
//       await ctx.store.remove(Delegation, clearDelegations);
//     }
//     // Upsert batches of entities with batch-optimized ctx.store.save
//     await Promise.all([
//       ctx.store.upsert([...delegations.values()]),
//       ctx.store.upsert([...sigs.values()]),
//     ]);
//   }
// );
const typeorm_store_1 = require("@subsquid/typeorm-store");
const model_1 = require("./model");
const processor_1 = require("./processor");
const evm_processor_1 = require("@subsquid/evm-processor");
const DelegateRegistry = __importStar(require("./abi/DelegateRegistry"));
const GnosisSafe = __importStar(require("./abi/GnosisSafe"));
// Helper function to decode event logs
function getDataFromLogs(log) {
    const eventDecoders = {
        [DelegateRegistry.events.SetDelegate.topic]: () => {
            const { delegator, id, delegate } = DelegateRegistry.events.SetDelegate.decode(log);
            const space = id;
            const eventId = `${delegator}-${space}-${delegate}`;
            return {
                type: "SetDelegate",
                id: eventId,
                delegator: (0, evm_processor_1.decodeHex)(delegator),
                space: space,
                delegate: (0, evm_processor_1.decodeHex)(delegate),
                timestamp: log.block.timestamp / 1000,
            };
        },
        [DelegateRegistry.events.ClearDelegate.topic]: () => {
            const { delegator, id, delegate } = DelegateRegistry.events.ClearDelegate.decode(log);
            const space = id;
            const eventId = `${delegator}-${space}-${delegate}`;
            return {
                type: "ClearDelegate",
                id: eventId,
                timestamp: BigInt(log.block.timestamp / 1000),
            };
        },
        [GnosisSafe.events.SignMsg.topic]: () => {
            const { msgHash } = GnosisSafe.events.SignMsg.decode(log);
            return {
                type: "SignMsg",
                id: log.transaction?.hash,
                account: (0, evm_processor_1.decodeHex)(log.address),
                msgHash: msgHash,
                timestamp: BigInt(log.block.timestamp / 1000), // Convert timestamp to seconds
            };
        },
    };
    const eventDecoder = eventDecoders[log.topics[0]];
    if (eventDecoder) {
        return eventDecoder();
    }
    return undefined; // Return undefined if no matching event is found
}
// Main processing logic
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const delegations = new Map();
    const sigs = new Map();
    const clearDelegations = [];
    for (let block of ctx.blocks) {
        const newBlock = new model_1.Block({
            id: block.header.hash,
            number: BigInt(block.header.height),
            timestamp: BigInt(block.header.timestamp),
        });
        await ctx.store.upsert([newBlock]);
        for (let log of block.logs) {
            const eventData = getDataFromLogs(log);
            if (eventData) {
                if (log.address === processor_1.CONTRACT_ADDRESS_DELEGATE) {
                    if (eventData.type === "SetDelegate") {
                        delegations.set(eventData.id, new model_1.Delegation({
                            id: eventData.id,
                            delegator: eventData.delegator,
                            space: eventData.space,
                            delegate: eventData.delegate,
                            timestamp: eventData.timestamp,
                        }));
                    }
                    else {
                        clearDelegations.push(eventData.id);
                    }
                }
                if (log.address in
                    [
                        processor_1.CONTRACT_ADDRESS_GNOSIS_SAFE_V1_0_0,
                        processor_1.CONTRACT_ADDRESS_GNOSIS_SAFE_V1_1_1,
                        processor_1.CONTRACT_ADDRESS_GNOSIS_SAFE_V1_3_0,
                    ] &&
                    eventData.type === "SignMsg") {
                    sigs.set(eventData.id, new model_1.Sig({
                        id: eventData.id,
                        account: eventData.account,
                        msgHash: eventData.msgHash,
                        timestamp: eventData.timestamp,
                    }));
                }
            }
        }
    }
    await ctx.store.upsert([...delegations.values()]);
    await ctx.store.upsert([...sigs.values()]);
    if (clearDelegations.length != 0) {
        await ctx.store.remove(model_1.Delegation, [...clearDelegations]);
    }
});
//# sourceMappingURL=main.js.map