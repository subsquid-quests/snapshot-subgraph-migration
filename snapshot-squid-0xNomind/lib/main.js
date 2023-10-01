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
const DelegateRegistry = __importStar(require("./abi/DelegateRegistry"));
const GnosisSafe = __importStar(require("./abi/GnosisSafe"));
const evm_processor_1 = require("@subsquid/evm-processor");
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    let delegations = new Map;
    let clearDelegations = [];
    let sigs = [];
    for (let block of ctx.blocks) {
        await ctx.store.insert(new model_1.Block({
            id: block.header.hash,
            number: BigInt(block.header.height),
            timestamp: BigInt(block.header.timestamp),
        }));
        for (let log of block.logs) {
            // decode and normalize the tx data
            if (log.topics[0] == GnosisSafe.events.SignMsg.topic) {
                let { msgHash } = GnosisSafe.events.SignMsg.decode(log);
                sigs.push(new model_1.Sig({
                    id: log.id,
                    account: (0, evm_processor_1.decodeHex)(log.address),
                    msgHash: msgHash,
                    timestamp: BigInt(block.header.timestamp),
                }));
                ctx.log.info(`SignMsg: [id: ${log.id}, account: ${log.address}], msgHash: ${msgHash}`);
            }
            if (log.address == processor_1.CONTRACT_ADDRESS_DELEGATE) {
                if (log.topics[0] == DelegateRegistry.events.SetDelegate.topic) {
                    let { delegator, id, delegate } = DelegateRegistry.events.SetDelegate.decode(log);
                    let space = id;
                    id = delegator.concat("-").concat(space).concat("-").concat(delegate);
                    delegations.set(id, new model_1.Delegation({
                        id: id,
                        delegator: (0, evm_processor_1.decodeHex)(delegator),
                        space: space,
                        delegate: (0, evm_processor_1.decodeHex)(delegate),
                        timestamp: BigInt(block.header.timestamp),
                    }));
                    ctx.log.info(`SetDelegate: [id: ${id}, delegator: ${delegator}], space: ${space}, delegate: ${delegate}`);
                }
                if (log.topics[0] == DelegateRegistry.events.ClearDelegate.topic) {
                    let { delegator, id, delegate } = DelegateRegistry.events.ClearDelegate.decode(log);
                    let space = id;
                    id = delegator.concat("-").concat(space).concat("-").concat(delegate);
                    clearDelegations.push(id);
                    ctx.log.info(`ClearDelegate: [id: ${id}, delegator: ${delegator}], space: ${space}, delegate: ${delegate}`);
                }
            }
        }
    }
    await ctx.store.upsert([...delegations.values()]);
    await ctx.store.upsert(sigs);
    if (clearDelegations.length != 0) {
        await ctx.store.remove(model_1.Delegation, [...clearDelegations]);
    }
});
//# sourceMappingURL=main.js.map