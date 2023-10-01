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
const GnosisSafeProxyFactory_v1_1_1_abi_1 = require("./GnosisSafeProxyFactory_v1.1.1.abi");
exports.abi = new ethers.Interface(GnosisSafeProxyFactory_v1_1_1_abi_1.ABI_JSON);
exports.events = {
    ProxyCreation: new abi_support_1.LogEvent(exports.abi, '0xa38789425dbeee0239e16ff2d2567e31720127fbc6430758c1a4efc6aef29f80'),
};
exports.functions = {
    createProxy: new abi_support_1.Func(exports.abi, '0x61b69abd'),
    proxyRuntimeCode: new abi_support_1.Func(exports.abi, '0xaddacc0f'),
    proxyCreationCode: new abi_support_1.Func(exports.abi, '0x53e5d935'),
    createProxyWithNonce: new abi_support_1.Func(exports.abi, '0x1688f0b9'),
    createProxyWithCallback: new abi_support_1.Func(exports.abi, '0xd18af54d'),
    calculateCreateProxyWithNonceAddress: new abi_support_1.Func(exports.abi, '0x2500510e'),
};
class Contract extends abi_support_1.ContractBase {
    proxyRuntimeCode() {
        return this.eth_call(exports.functions.proxyRuntimeCode, []);
    }
    proxyCreationCode() {
        return this.eth_call(exports.functions.proxyCreationCode, []);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=GnosisSafeProxyFactory_v1.1.1.js.map