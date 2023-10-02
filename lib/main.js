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
    // Check if the log matches the SetDelegate event from DelegateRegistry
    if (log.topics[0] === DelegateRegistry.events.SetDelegate.topic) {
        let { delegator, id, delegate } = DelegateRegistry.events.SetDelegate.decode(log);
        // Convert the string addresses to Uint8Array
        let delegatorBytes = (0, evm_processor_1.decodeHex)(delegator);
        let delegateBytes = (0, evm_processor_1.decodeHex)(delegate);
        let space = id;
        let timestamp = log.block.timestamp / 1000; // Convert timestamp to seconds
        let idString = delegator
            .concat("-")
            .concat(space)
            .concat("-")
            .concat(delegate);
        return {
            id: idString,
            delegate: delegateBytes,
            delegator: delegatorBytes,
            space,
            timestamp,
        };
    }
    // Check if the log matches the ClearDelegate event from DelegateRegistry
    if (log.topics[0] === DelegateRegistry.events.ClearDelegate.topic) {
        let { delegator, id, delegate } = DelegateRegistry.events.SetDelegate.decode(log);
        // Convert the string addresses to Uint8Array
        let delegatorBytes = (0, evm_processor_1.decodeHex)(delegator);
        let delegateBytes = (0, evm_processor_1.decodeHex)(delegate);
        let space = id;
        let timestamp = log.block.timestamp / 1000; // Convert timestamp to seconds
        let idString = delegator
            .concat("-")
            .concat(space)
            .concat("-")
            .concat(delegate);
        return {
            id: idString,
            delegate: delegateBytes,
            delegator: delegatorBytes,
            space,
            timestamp,
        };
    }
    // Check if the log matches the SignMsg event from GnosisSafe
    if (log.topics[0] === GnosisSafe.events.SignMsg.topic) {
        let { msgHash } = GnosisSafe.events.SignMsg.decode(log);
        let delegatorBytes = (0, evm_processor_1.decodeHex)(log.address);
        let id = log.transaction?.hash;
        let timestamp = BigInt(log.block.timestamp / 1000); // Convert timestamp to seconds
        return { id, msgHash, delegator: delegatorBytes, timestamp };
    }
    return undefined; // Return undefined if no matching event is found
}
// Main processing logic
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const delegations = new Map();
    const sigs = new Map();
    const clearDelegations = [];
    // Iterate through blocks and logs
    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            console.log(log.topics[0]);
            console.log("gnosis", GnosisSafe.events.SignMsg.topic);
            console.log("delegations", DelegateRegistry.events.SetDelegate.topic);
            if (log.topics[0] == GnosisSafe.events.SignMsg.topic) {
                let result = getDataFromLogs(log);
                if (result !== undefined) {
                    // Process as Sig
                    let sig = new model_1.Sig({
                        id: result.id,
                        account: result.delegator,
                        msgHash: result.msgHash,
                        timestamp: result.timestamp,
                    });
                    sigs.set(result.id, sig);
                    ctx.log.info(`SignMsg: [id: ${result.id}, account: ${log.address}], msgHash: ${result.msgHash}`);
                }
            }
            if (log.address === processor_1.CONTRACT_ADDRESS_DELEGATE) {
                console.log("I ran");
                try {
                    // Get data from logs
                    let result = getDataFromLogs(log);
                    if (result !== undefined) {
                        if (log.topics[0] === DelegateRegistry.events.ClearDelegate.topic) {
                            // Handle ClearDelegate event
                            let id = result.id;
                            clearDelegations.push(id); // Add ID to list of delegations to clear
                        }
                        else {
                            // Handle SetDelegate event
                            let delegation = new model_1.Delegation({
                                id: result.id,
                                delegate: result.delegate,
                                delegator: result.delegator,
                                space: result.space,
                                timestamp: result.timestamp,
                            });
                            delegations.set(result.id, delegation);
                            ctx.log.info(`Delegation: [id: ${result.id}, delegator: ${result.delegator}], space: ${result.space}, delegate: ${result.delegate}`);
                        }
                    }
                }
                catch (err) {
                    console.error("Error processing log:", err);
                }
            }
        }
    }
    // Remove delegations if ClearDelegate events were detected
    if (clearDelegations.length !== 0) {
        await ctx.store.remove(model_1.Delegation, clearDelegations);
    }
    // upsert batches of entities with batch-optimized ctx.store.save
    await Promise.all([
        ctx.store.upsert([...delegations.values()]),
        ctx.store.upsert([...sigs.values()]),
    ]);
});
//# sourceMappingURL=main.js.map