export const ABI_JSON = [
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
        "name": "createProxyWithCallback",
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
            },
            {
                "type": "address",
                "name": "callback"
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
        "name": "calculateCreateProxyWithNonceAddress",
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
    }
]
