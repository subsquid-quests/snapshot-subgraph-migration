import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './GnosisSafeProxyFactory_v1.1.1.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    ProxyCreation: new LogEvent<([proxy: string] & {proxy: string})>(
        abi, '0xa38789425dbeee0239e16ff2d2567e31720127fbc6430758c1a4efc6aef29f80'
    ),
}

export const functions = {
    createProxy: new Func<[masterCopy: string, data: string], {masterCopy: string, data: string}, string>(
        abi, '0x61b69abd'
    ),
    proxyRuntimeCode: new Func<[], {}, string>(
        abi, '0xaddacc0f'
    ),
    proxyCreationCode: new Func<[], {}, string>(
        abi, '0x53e5d935'
    ),
    createProxyWithNonce: new Func<[_mastercopy: string, initializer: string, saltNonce: bigint], {_mastercopy: string, initializer: string, saltNonce: bigint}, string>(
        abi, '0x1688f0b9'
    ),
    createProxyWithCallback: new Func<[_mastercopy: string, initializer: string, saltNonce: bigint, callback: string], {_mastercopy: string, initializer: string, saltNonce: bigint, callback: string}, string>(
        abi, '0xd18af54d'
    ),
    calculateCreateProxyWithNonceAddress: new Func<[_mastercopy: string, initializer: string, saltNonce: bigint], {_mastercopy: string, initializer: string, saltNonce: bigint}, string>(
        abi, '0x2500510e'
    ),
}

export class Contract extends ContractBase {

    proxyRuntimeCode(): Promise<string> {
        return this.eth_call(functions.proxyRuntimeCode, [])
    }

    proxyCreationCode(): Promise<string> {
        return this.eth_call(functions.proxyCreationCode, [])
    }
}
