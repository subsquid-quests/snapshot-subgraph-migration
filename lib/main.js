"use strict";
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
                blockNumber: log.blockNumber,
                block: log.block,
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
                blockNumber: log.blockNumber,
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
                blockNumber: log.blockNumber,
                block: log.block,
                msgHash,
                delegator: (0, evm_processor_1.decodeHex)(log.address),
                timestamp: BigInt(log.block.timestamp / 1000), // Convert timestamp to seconds
            };
        },
    };
    const eventDecoder = eventDecoders[log.topics[0]];
    if (eventDecoder) {
        console.log(eventDecoder);
        try {
            return eventDecoder();
        }
        catch (err) {
            console.error("Error decoding event:", err);
        }
    }
    return undefined; // Return undefined if no matching event is found
}
async function addBlockToDatabase(ctx, block) {
    try {
        console.log("block header", block);
        await ctx.store.insert(new model_1.Block({
            id: block.hash,
            number: BigInt(block.height),
            timestamp: BigInt(block.timestamp / 1000), // converted to seconds
        }));
    }
    catch (err) {
        console.error("Error adding block to the database:", err);
    }
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
                        await addBlockToDatabase(ctx, setDelegateResult.block);
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
                    await addBlockToDatabase(ctx, signMsgResult.block);
                }
            }
        }
        catch (err) {
            console.error("Error processing logs:", err);
        }
    }
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