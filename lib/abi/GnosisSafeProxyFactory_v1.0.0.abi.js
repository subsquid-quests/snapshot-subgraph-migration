"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABI_JSON = void 0;
exports.ABI_JSON = [
    {
        "type": "function",
        "name": "createProxyWithNonce",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_mastercopy"
            },
            {
                "type": "bytes",
                "name": "initializer"
            },
            {
                "type": "uint256",
                "name": "saltNonce"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "proxy"
            }
        ]
    },
    {
        "type": "function",
        "name": "proxyCreationCode",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "createProxy",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "masterCopy"
            },
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": "proxy"
            }
        ]
    },
    {
        "type": "function",
        "name": "proxyRuntimeCode",
        "constant": true,
        "stateMutability": "pure",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes",
                "name": ""
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ProxyCreation",
        "inputs": [
            {
                "type": "address",
                "name": "proxy",
                "indexed": false
            }
        ]
    }
];
//# sourceMappingURL=GnosisSafeProxyFactory_v1.0.0.abi.js.map