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
const Gravity_abi_1 = require("./Gravity.abi");
exports.abi = new ethers.Interface(Gravity_abi_1.ABI_JSON);
exports.events = {
    NewGravatar: new abi_support_1.LogEvent(exports.abi, '0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b'),
    UpdatedGravatar: new abi_support_1.LogEvent(exports.abi, '0x76571b7a897a1509c641587568218a290018fbdc8b9a724f17b77ff0eec22c0c'),
};
exports.functions = {
    updateGravatarImage: new abi_support_1.Func(exports.abi, '0x0081d6e5'),
    setMythicalGravatar: new abi_support_1.Func(exports.abi, '0x1d4f2c6d'),
    getGravatar: new abi_support_1.Func(exports.abi, '0x359c1f72'),
    gravatarToOwner: new abi_support_1.Func(exports.abi, '0x88d0d391'),
    ownerToGravatar: new abi_support_1.Func(exports.abi, '0xa5ac3634'),
    updateGravatarName: new abi_support_1.Func(exports.abi, '0xb18588fb'),
    createGravatar: new abi_support_1.Func(exports.abi, '0xcdb3344a'),
    gravatars: new abi_support_1.Func(exports.abi, '0xd5ce24ed'),
};
class Contract extends abi_support_1.ContractBase {
    getGravatar(owner) {
        return this.eth_call(exports.functions.getGravatar, [owner]);
    }
    gravatarToOwner(arg0) {
        return this.eth_call(exports.functions.gravatarToOwner, [arg0]);
    }
    ownerToGravatar(arg0) {
        return this.eth_call(exports.functions.ownerToGravatar, [arg0]);
    }
    gravatars(arg0) {
        return this.eth_call(exports.functions.gravatars, [arg0]);
    }
}
exports.Contract = Contract;
//# sourceMappingURL=Gravity.js.map