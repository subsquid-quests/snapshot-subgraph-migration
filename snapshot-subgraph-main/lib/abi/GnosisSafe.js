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
exports.Contract = exports.functions = exports.events = exports.abi = void 0;
const ethers = __importStar(require("ethers"));
const abi_support_1 = require("./abi.support");
const GnosisSafe_abi_1 = require("./GnosisSafe.abi");
exports.abi = new ethers.Interface(GnosisSafe_abi_1.ABI_JSON);
exports.events = {
    AddedOwner: new abi_support_1.LogEvent(exports.abi, '0x9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea26'),
    ApproveHash: new abi_support_1.LogEvent(exports.abi, '0xf2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c'),
    ChangedFallbackHandler: new abi_support_1.LogEvent(exports.abi, '0x5ac6c46c93c8d0e53714ba3b53db3e7c046da994313d7ed0d192028bc7c228b0'),
    ChangedGuard: new abi_support_1.LogEvent(exports.abi, '0x1151116914515bc0891ff9047a6cb32cf902546f83066499bcf8ba33d2353fa2'),
    ChangedThreshold: new abi_support_1.LogEvent(exports.abi, '0x610f7ff2b304ae8903c3de74c60c6ab1f7d6226b3f52c5161905bb5ad4039c93'),
    DisabledModule: new abi_support_1.LogEvent(exports.abi, '0xaab4fa2b463f581b2b32cb3b7e3b704b9ce37cc209b5fb4d77e593ace4054276'),
    EnabledModule: new abi_support_1.LogEvent(exports.abi, '0xecdf3a3effea5783a3c4c2140e677577666428d44ed9d474a0b3a4c9943f8440'),
    ExecutionFailure: new abi_support_1.LogEvent(exports.abi, '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23'),
    ExecutionFromModuleFailure: new abi_support_1.LogEvent(exports.abi, '0xacd2c8702804128fdb0db2bb49f6d127dd0181c13fd45dbfe16de0930e2bd375'),
    ExecutionFromModuleSuccess: new abi_support_1.LogEvent(exports.abi, '0x6895c13664aa4f67288b25d7a21d7aaa34916e355fb9b6fae0a139a9085becb8'),
    ExecutionSuccess: new abi_support_1.LogEvent(exports.abi, '0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e'),
    RemovedOwner: new abi_support_1.LogEvent(exports.abi, '0xf8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf'),
    SafeReceived: new abi_support_1.LogEvent(exports.abi, '0x3d0ce9bfc3ed7d6862dbb28b2dea94561fe714a1b4d019aa8af39730d1ad7c3d'),
    SafeSetup: new abi_support_1.LogEvent(exports.abi, '0x141df868a6331af528e38c83b7aa03edc19be66e37ae67f9285bf4f8e3c6a1a8'),
    SignMsg: new abi_support_1.LogEvent(exports.abi, '0xe7f4675038f4f6034dfcbbb24c4dc08e4ebf10eb9d257d3d02c0f38d122ac6e4'),
};
exports.functions = {
    VERSION: new abi_support_1.Func(exports.abi, '0xffa1ad74'),
    addOwnerWithThreshold: new abi_support_1.Func(exports.abi, '0x0d582f13'),
    approveHash: new abi_support_1.Func(exports.abi, '0xd4d9bdcd'),
    approvedHashes: new abi_support_1.Func(exports.abi, '0x7d832974'),
    changeThreshold: new abi_support_1.Func(exports.abi, '0x694e80c3'),
    checkNSignatures: new abi_support_1.Func(exports.abi, '0x12fb68e0'),
    checkSignatures: new abi_support_1.Func(exports.abi, '0x934f3a11'),
    disableModule: new abi_support_1.Func(exports.abi, '0xe009cfde'),
    domainSeparator: new abi_support_1.Func(exports.abi, '0xf698da25'),
    enableModule: new abi_support_1.Func(exports.abi, '0x610b5925'),
    encodeTransactionData: new abi_support_1.Func(exports.abi, '0xe86637db'),
    execTransaction: new abi_support_1.Func(exports.abi, '0x6a761202'),
    execTransactionFromModule: new abi_support_1.Func(exports.abi, '0x468721a7'),
    execTransactionFromModuleReturnData: new abi_support_1.Func(exports.abi, '0x5229073f'),
    getChainId: new abi_support_1.Func(exports.abi, '0x3408e470'),
    getModulesPaginated: new abi_support_1.Func(exports.abi, '0xcc2f8452'),
    getOwners: new abi_support_1.Func(exports.abi, '0xa0e67e2b'),
    getStorageAt: new abi_support_1.Func(exports.abi, '0x5624b25b'),
    getThreshold: new abi_support_1.Func(exports.abi, '0xe75235b8'),
    getTransactionHash: new abi_support_1.Func(exports.abi, '0xd8d11f78'),
    isModuleEnabled: new abi_support_1.Func(exports.abi, '0x2d9ad53d'),
    isOwner: new abi_support_1.Func(exports.abi, '0x2f54bf6e'),
    nonce: new abi_support_1.Func(exports.abi, '0xaffed0e0'),
    removeOwner: new abi_support_1.Func(exports.abi, '0xf8dc5dd9'),
    requiredTxGas: new abi_support_1.Func(exports.abi, '0xc4ca3a9c'),
    setFallbackHandler: new abi_support_1.Func(exports.abi, '0xf08a0323'),
    setGuard: new abi_support_1.Func(exports.abi, '0xe19a9dd9'),
    setup: new abi_support_1.Func(exports.abi, '0xb63e800d'),
    signedMessages: new abi_support_1.Func(exports.abi, '0x5ae6bd37'),
    simulateAndRevert: new abi_support_1.Func(exports.abi, '0xb4faba09'),
    swapOwner: new abi_support_1.Func(exports.abi, '0xe318b52b'),
};
class Contract extends abi_support_1.ContractBase {
    VERSION() {
        return this.eth_call(exports.functions.VERSION, []);
    }
    approvedHashes(arg0, arg1) {
        return this.eth_call(exports.functions.approvedHashes, [arg0, arg1]);
    }
    domainSeparator() {
        return this.eth_call(exports.functions.domainSeparator, []);
    }
    encodeTransactionData(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce) {
        return this.eth_call(exports.functions.encodeTransactionData, [to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce]);
    }
    getChainId() {
        return this.eth_call(exports.functions.getChainId, []);
    }
    getModulesPaginated(start, pageSize) {
        return this.eth_call(exports.functions.getModulesPaginated, [start, pageSize]);
    }
    getOwners() {
        return this.eth_call(exports.functions.getOwners, []);
    }
    getStorageAt(offset, length) {
        return this.eth_call(exports.functions.getStorageAt, [offset, length]);
    }
    getThreshold() {
        return this.eth_call(exports.functions.getThreshold, []);
    }
    getTransactionHash(to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce) {
        return this.eth_call(exports.functions.getTransactionHash, [to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce]);
    }
    isModuleEnabled(module) {
        return this.eth_call(exports.functions.isModuleEnabled, [module]);
    }
    isOwner(owner) {
        return this.eth_call(exports.functions.isOwner, [owner]);
    }
    nonce() {
        return this.eth_call(exports.functions.nonce, []);
    }
    signedMessages(arg0) {
        return this.eth_call(exports.functions.signedMessages, [arg0]);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=GnosisSafe.js.map