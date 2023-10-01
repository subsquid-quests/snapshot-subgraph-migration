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
const DelegateRegistry_abi_1 = require("./DelegateRegistry.abi");
exports.abi = new ethers.Interface(DelegateRegistry_abi_1.ABI_JSON);
exports.events = {
    ClearDelegate: new abi_support_1.LogEvent(exports.abi, '0x9c4f00c4291262731946e308dc2979a56bd22cce8f95906b975065e96cd5a064'),
    SetDelegate: new abi_support_1.LogEvent(exports.abi, '0xa9a7fd460f56bddb880a465a9c3e9730389c70bc53108148f16d55a87a6c468e'),
};
exports.functions = {
    delegation: new abi_support_1.Func(exports.abi, '0x74c6c454'),
    setDelegate: new abi_support_1.Func(exports.abi, '0xbd86e508'),
    clearDelegate: new abi_support_1.Func(exports.abi, '0xf0bedbe2'),
};
class Contract extends abi_support_1.ContractBase {
    delegation(arg0, arg1) {
        return this.eth_call(exports.functions.delegation, [arg0, arg1]);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=DelegateRegistry.js.map