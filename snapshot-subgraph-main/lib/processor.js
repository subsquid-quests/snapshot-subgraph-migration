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
exports.processor = void 0;
const archive_registry_1 = require("@subsquid/archive-registry");
const evm_processor_1 = require("@subsquid/evm-processor");
const DelegateRegistry = __importStar(require("./abi/DelegateRegistry"));
const GnosisSafe = __importStar(require("./abi/GnosisSafe"));
exports.processor = new evm_processor_1.EvmBatchProcessor()
    .setDataSource({
    // Change the Archive endpoints for run the squid
    // against the other EVM networks
    // For a full list of supported networks and config options
    // see https://docs.subsquid.io/evm-indexing/
    archive: (0, archive_registry_1.lookupArchive)('eth-mainnet'),
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
    from: 6000000,
})
    .addLog({
    address: ["0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446"],
    topic0: [DelegateRegistry.events.SetDelegate.topic, DelegateRegistry.events.ClearDelegate.topic],
})
    .addLog({
    address: ["0x12302fE9c02ff50939BaAaaf415fc226C078613C", "0x76E2cFc1F5Fa8F6a5b3fC4c8F4788F0116861F9B", "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2"],
    topic0: [GnosisSafe.events.SignMsg.topic],
});
//# sourceMappingURL=processor.js.map