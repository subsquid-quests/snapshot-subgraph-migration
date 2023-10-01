import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './GnosisSafeProxyFactory_v1.3.0.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    ProxyCreation: new LogEvent<([proxy: string, singleton: string] & {proxy: string, singleton: string})>(
        abi, '0x4f51faf6c4561ff95f067657e43439f0f856d97c04d9ec9070a6199ad418e235'
    ),
}

export const functions = {
    calculateCreateProxyWithNonceAddress: new Func<[_singleton: string, initializer: string, saltNonce: bigint], {_singleton: string, initializer: string, saltNonce: bigint}, string>(
        abi, '0x2500510e'
    ),
    createProxy: new Func<[singleton: string, data: string], {singleton: string, data: string}, string>(
        abi, '0x61b69abd'
    ),
    createProxyWithCallback: new Func<[_singleton: string, initializer: string, saltNonce: bigint, callback: string], {_singleton: string, initializer: string, saltNonce: bigint, callback: string}, string>(
        abi, '0xd18af54d'
    ),
    createProxyWithNonce: new Func<[_singleton: string, initializer: string, saltNonce: bigint], {_singleton: string, initializer: string, saltNonce: bigint}, string>(
        abi, '0x1688f0b9'
    ),
    proxyCreationCode: new Func<[], {}, string>(
        abi, '0x53e5d935'
    ),
    proxyRuntimeCode: new Func<[], {}, string>(
        abi, '0xaddacc0f'
    ),
}

export class Contract extends ContractBase {

    proxyCreationCode(): Promise<string> {
        return this.eth_call(functions.proxyCreationCode, [])
    }

    proxyRuntimeCode(): Promise<string> {
        return this.eth_call(functions.proxyRuntimeCode, [])
    }
}
