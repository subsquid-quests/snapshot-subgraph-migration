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
const GravatarABI = __importStar(require("./abi/Gravity"));
processor_1.processor.run(new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const gravatars = new Map();
    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            let { idString, owner, displayName, imageUrl } = extractData(log);
            let gravatar = new model_1.Gravatar({
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
function extractData(log) {
    if (log.topics[0] === GravatarABI.events.NewGravatar.topic) {
        let { id, owner, displayName, imageUrl } = GravatarABI.events.NewGravatar.decode(log);
        let idString = id.toString(16);
        return { idString, owner, displayName, imageUrl };
    }
    if (log.topics[0] === GravatarABI.events.UpdatedGravatar.topic) {
        let { id, owner, displayName, imageUrl } = GravatarABI.events.UpdatedGravatar.decode(log);
        let idString = id.toString(16);
        return { idString, owner, displayName, imageUrl };
    }
    throw new Error('Unsupported topic');
}
//# sourceMappingURL=main.js.map