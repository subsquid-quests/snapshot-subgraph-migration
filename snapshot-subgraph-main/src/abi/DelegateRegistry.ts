import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './DelegateRegistry.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    ClearDelegate: new LogEvent<([delegator: string, id: string, delegate: string] & {delegator: string, id: string, delegate: string})>(
        abi, '0x9c4f00c4291262731946e308dc2979a56bd22cce8f95906b975065e96cd5a064'
    ),
    SetDelegate: new LogEvent<([delegator: string, id: string, delegate: string] & {delegator: string, id: string, delegate: string})>(
        abi, '0xa9a7fd460f56bddb880a465a9c3e9730389c70bc53108148f16d55a87a6c468e'
    ),
}

export const functions = {
    delegation: new Func<[_: string, _: string], {}, string>(
        abi, '0x74c6c454'
    ),
    setDelegate: new Func<[id: string, delegate: string], {id: string, delegate: string}, []>(
        abi, '0xbd86e508'
    ),
    clearDelegate: new Func<[id: string], {id: string}, []>(
        abi, '0xf0bedbe2'
    ),
}

export class Contract extends ContractBase {

    delegation(arg0: string, arg1: string): Promise<string> {
        return this.eth_call(functions.delegation, [arg0, arg1])
    }
}
