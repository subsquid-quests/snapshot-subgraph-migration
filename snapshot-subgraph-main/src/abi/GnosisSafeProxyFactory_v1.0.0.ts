import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './GnosisSafeProxyFactory_v1.0.0.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    ProxyCreation: new LogEvent<([proxy: string] & {proxy: string})>(
        abi, '0xa38789425dbeee0239e16ff2d2567e31720127fbc6430758c1a4efc6aef29f80'
    ),
}

export const functions = {
    createProxyWithNonce: new Func<[_mastercopy: string, initializer: string, saltNonce: bigint], {_mastercopy: string, initializer: string, saltNonce: bigint}, string>(
        abi, '0x1688f0b9'
    ),
    proxyCreationCode: new Func<[], {}, string>(
        abi, '0x53e5d935'
    ),
    createProxy: new Func<[masterCopy: string, data: string], {masterCopy: string, data: string}, string>(
        abi, '0x61b69abd'
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
