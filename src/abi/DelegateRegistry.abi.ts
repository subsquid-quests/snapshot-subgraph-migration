export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "ClearDelegate",
        "inputs": [
            {
                "type": "address",
                "name": "delegator",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "id",
                "indexed": true
            },
            {
                "type": "address",
                "name": "delegate",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "SetDelegate",
        "inputs": [
            {
                "type": "address",
                "name": "delegator",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "id",
                "indexed": true
            },
            {
                "type": "address",
                "name": "delegate",
                "indexed": true
            }
        ]
    },
    {
        "type": "function",
        "name": "delegation",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": ""
            },
            {
                "type": "bytes32",
                "name": ""
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "setDelegate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "id"
            },
            {
                "type": "address",
                "name": "delegate"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "clearDelegate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "id"
            }
        ],
        "outputs": []
    }
]
