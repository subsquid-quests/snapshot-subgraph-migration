"use strict";
// import { TypeormDatabase } from "@subsquid/typeorm-store";
// import { Block, Delegation, Sig } from "./model";
// import { CONTRACT_ADDRESS_DELEGATE, processor } from "./processor";
// import { decodeHex } from "@subsquid/evm-processor";
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
// function getDataFromLogs(log: any):
//   | {
//       id: string;
//       delegate?: any;
//       delegator: any;
//       space?: string;
//       msgHash?: string;
//       timestamp: any;
//     }
//   | undefined {
//   // Check if the log matches the SetDelegate event from DelegateRegistry
//   if (log.topics[0] === DelegateRegistry.events.SetDelegate.topic) {
//     let { delegator, id, delegate } =
//       DelegateRegistry.events.SetDelegate.decode(log);
//     // Convert the string addresses to Uint8Array
//     let delegatorBytes = decodeHex(delegator);
//     let delegateBytes = decodeHex(delegate);
//     let space = id;
//     let timestamp = log.block.timestamp / 1000; // Convert timestamp to seconds
//     let idString = delegator
//       .concat("-")
//       .concat(space)
//       .concat("-")
//       .concat(delegate);
//     return {
//       id: idString,
//       delegate: delegateBytes,
//       delegator: delegatorBytes,
//       space,
//       timestamp,
//     };
//   }
//   // Check if the log matches the ClearDelegate event from DelegateRegistry
//   if (log.topics[0] === DelegateRegistry.events.ClearDelegate.topic) {
//     let { delegator, id, delegate } =
//       DelegateRegistry.events.SetDelegate.decode(log);
//     // Convert the string addresses to Uint8Array
//     let delegatorBytes = decodeHex(delegator);
//     let delegateBytes = decodeHex(delegate);
//     let space = id;
//     let timestamp = log.block.timestamp / 1000; // Convert timestamp to seconds
//     let idString = delegator
//       .concat("-")
//       .concat(space)
//       .concat("-")
//       .concat(delegate);
//     return {
//       id: idString,
//       delegate: delegateBytes,
//       delegator: delegatorBytes,
//       space,
//       timestamp,
//     };
//   }
//   // Check if the log matches the SignMsg event from GnosisSafe
//   if (log.topics[0] === GnosisSafe.events.SignMsg.topic) {
//     let { msgHash } = GnosisSafe.events.SignMsg.decode(log);
//     let delegatorBytes = decodeHex(log.address);
//     let id = log.transaction?.hash;
//     let timestamp = BigInt(log.block.timestamp / 1000); // Convert timestamp to seconds
//     return { id, msgHash, delegator: delegatorBytes, timestamp };
//   }
//   return undefined; // Return undefined if no matching event is found
// }
// // Main processing logic
// processor.run(
//   new TypeormDatabase({ supportHotBlocks: true }),
//   async (ctx: {
//     blocks: any;
//     log: { info: (arg0: string) => void };
//     store: {
//       remove: (arg0: typeof Delegation, arg1: string[]) => any;
//       upsert: (arg0: Delegation[] | Sig[]) => any;
//     };
//   }) => {
//     const delegations: Map<string, Delegation> = new Map();
//     const sigs: Map<string, Sig> = new Map();
//     const clearDelegations: string[] = [];
//     // Iterate through blocks and logs
//     for (let c of ctx.blocks) {
//       for (let log of c.logs) {
//         if (log.topics[0] == GnosisSafe.events.SignMsg.topic) {
//           let result = getDataFromLogs(log);
//           if (result !== undefined) {
//             // Process as Sig
//             let sig = new Sig({
//               id: result.id,
//               account: result.delegator,
//               msgHash: result.msgHash,
//               timestamp: result.timestamp,
//             });
//             sigs.set(result.id, sig);
//             ctx.log.info(
//               `SignMsg: [id: ${result.id}, account: ${log.address}], msgHash: ${result.msgHash}`
//             );
//           }
//         }
//         if (log.address === CONTRACT_ADDRESS_DELEGATE) {
//           try {
//             // Get data from logs
//             let result = getDataFromLogs(log);
//             if (result !== undefined) {
//               if (
//                 log.topics[0] === DelegateRegistry.events.ClearDelegate.topic
//               ) {
//                 // Handle ClearDelegate event
//                 clearDelegations.push(result.id); // Add ID to list of delegations to clear
//               } else {
//                 // Handle SetDelegate event
//                 let delegation = new Delegation({
//                   id: result.id,
//                   delegate: result.delegate,
//                   delegator: result.delegator,
//                   space: result.space,
//                   timestamp: result.timestamp,
//                 });
//                 delegations.set(result.id, delegation);
//                 ctx.log.info(
//                   `Delegation: [id: ${result.id}, delegator: ${result.delegator}], space: ${result.space}, delegate: ${result.delegate}`
//                 );
//               }
//             }
//           } catch (err) {
//             console.error("Error processing log:", err);
//           }
//         }
//       }
//     }
//     console.log(delegations);
//     // Remove delegations if ClearDelegate events were detected
//     if (clearDelegations.length !== 0) {
//       await ctx.store.remove(Delegation, [...clearDelegations]);
//     }
//     // upsert batches of entities with batch-optimized ctx.store.save
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
// Create a function to process logs and return data
function getDataFromLogs(log) {
    // Define a mapping of event topics to event decoding functions
    const eventDecoders = {
        [DelegateRegistry.events.SetDelegate.topic]: () => {
            const { delegator, id, delegate } = DelegateRegistry.events.SetDelegate.decode(log);
            return {
                type: "SetDelegate",
                id: `${delegator}-${id}-${delegate}`,
                delegate: (0, evm_processor_1.decodeHex)(delegate),
                delegator: (0, evm_processor_1.decodeHex)(delegator),
                space: id,
                timestamp: log.block.timestamp / 1000, // Convert timestamp to seconds
            };
        },
        [DelegateRegistry.events.ClearDelegate.topic]: () => {
            const { delegator, id, delegate } = DelegateRegistry.events.ClearDelegate.decode(log);
            return {
                type: "ClearDelegate",
                id: `${delegator}-${id}-${delegate}`,
                delegate: (0, evm_processor_1.decodeHex)(delegate),
                delegator: (0, evm_processor_1.decodeHex)(delegator),
                space: id,
                timestamp: log.block.timestamp / 1000, // Convert timestamp to seconds
            };
        },
        [GnosisSafe.events.SignMsg.topic]: () => {
            const { msgHash } = GnosisSafe.events.SignMsg.decode(log);
            return {
                type: "SignMsg",
                id: log.transaction?.hash,
                msgHash,
                delegator: (0, evm_processor_1.decodeHex)(log.address),
                timestamp: BigInt(log.block.timestamp / 1000), // Convert timestamp to seconds
            };
        },
    };
    const eventDecoder = eventDecoders[log.topics[0]];
    if (eventDecoder) {
        try {
            return eventDecoder();
        }
        catch (err) {
            console.error("Error decoding event:", err);
        }
    }
    return undefined; // Return undefined if no matching event is found
}
// Main processing logic
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const delegations = new Map();
    const sigs = new Map();
    const clearDelegations = [];
    const batchedLogs = ctx.blocks.flatMap((block) => block.logs);
    const batchedLogsByContract = batchedLogs.reduce((logsByContract, log) => {
        if (!logsByContract[log.address]) {
            logsByContract[log.address] = [];
        }
        logsByContract[log.address].push(log);
        return logsByContract;
    }, {});
    // Batch processing logs for each contract
    for (const [contractAddress, logs] of Object.entries(batchedLogsByContract)) {
        try {
            // Get data from logs
            const results = logs
                .map(getDataFromLogs)
                .filter((result) => result !== undefined);
            for (const result of results) {
                if (contractAddress === processor_1.CONTRACT_ADDRESS_DELEGATE) {
                    if (result.type === "ClearDelegate") {
                        // Handle ClearDelegate event
                        clearDelegations.push(result.id); // Add ID to list of delegations to clear
                    }
                    else {
                        const setDelegateResult = result;
                        // Handle SetDelegate event
                        delegations.set(setDelegateResult.id, new model_1.Delegation({
                            id: setDelegateResult.id,
                            delegate: setDelegateResult.delegate,
                            delegator: setDelegateResult.delegator,
                            space: setDelegateResult.space,
                            timestamp: setDelegateResult.timestamp,
                        }));
                    }
                }
                else {
                    // Process as Sig
                    const signMsgResult = result;
                    sigs.set(signMsgResult.id, new model_1.Sig({
                        id: signMsgResult.id,
                        account: signMsgResult.delegator,
                        msgHash: signMsgResult.msgHash,
                        timestamp: signMsgResult.timestamp,
                    }));
                }
            }
        }
        catch (err) {
            console.error("Error processing logs:", err);
        }
    }
    console.log(delegations);
    // Remove delegations if ClearDelegate events were detected
    if (clearDelegations.length !== 0) {
        await ctx.store.remove(model_1.Delegation, clearDelegations);
    }
    // Upsert batches of entities with batch-optimized ctx.store.save
    await Promise.all([
        ctx.store.upsert([...delegations.values()]),
        ctx.store.upsert([...sigs.values()]),
    ]);
});
//# sourceMappingURL=main.js.map