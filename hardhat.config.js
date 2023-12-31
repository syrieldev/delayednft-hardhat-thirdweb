require("@matterlabs/hardhat-zksync-solc")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
const { utils } = require("ethers")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const MAINNET_RPC_URL =
    process.env.MAINNET_RPC_URL ||
    process.env.ALCHEMY_MAINNET_RPC_URL ||
    "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const POLYGON_MAINNET_RPC_URL =
    process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "0x"
const SEPOLIA_SECOND_PRIVATE_KEY = process.env.SEPOLIA_SECOND_PRIVATE_KEYP || "0x"
// optional
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key"
const REPORT_GAS = process.env.REPORT_GAS || false

module.exports = {
    defaultNetwork: "hardhat",
    zksolc: {
        version: "1.3.9",
        compilerSource: "binary",
        settings: {
            optimizer: {
                enabled: true,
            },
        },
    },
    networks: {
        hardhat: {
            // // If you want to do some forking, uncomment this
            // forking: {
            //     url: MAINNET_RPC_URL,
            // },
            chainId: 31337,
            // accounts: [
            //     {
            //         privateKey: randomPrivateKey, // Replace with your private key
            //         balance: "10000000000000000000000", // 10000 ETH
            //     },
            // ],
        },
        localhost: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [
                SEPOLIA_PRIVATE_KEY !== undefined ? `0x${process.env.SEPOLIA_PRIVATE_KEY}` : "",
                SEPOLIA_SECOND_PRIVATE_KEY !== undefined
                    ? `0x${process.env.SEPOLIA_SECOND_PRIVATE_KEY}`
                    : "",
            ],
            saveDeployments: true,
            chainId: 11155111,
            blockConfirmations: 6,
        },

        mainnet: {
            url: MAINNET_RPC_URL,
            // accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            //   accounts: {
            //     mnemonic: MNEMONIC,
            //   },
            saveDeployments: true,
            chainId: 1,
        },
        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            // accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            saveDeployments: true,
            chainId: 137,
        },
        zksync_testnet: {
            url: "https://zksync2-testnet.zksync.dev",
            ethNetwork: "goerli",
            chainId: 280,
            zksync: true,
        },
        zksync_mainnet: {
            url: "https://zksync2-mainnet.zksync.io/",
            ethNetwork: "mainnet",
            chainId: 324,
            zksync: true,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
            polygon: POLYGONSCAN_API_KEY,
        },
        customChains: [
            {
                network: "goerli",
                chainId: 5,
                urls: {
                    apiURL: "https://api-goerli.etherscan.io/api",
                    browserURL: "https://goerli.etherscan.io",
                },
            },
        ],
    },
    paths: {
        artifacts: "./artifacts-zk",
        cache: "./cache-zk",
        sources: "./contracts",
        tests: "./test",
    },
    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        newOwner: {
            default: 1,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.7",
            },
            {
                version: "0.8.8",
            },
            {
                version: "0.6.6",
            },
            {
                version: "0.6.0",
            },
            {
                version: "0.8.11",
            },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    mocha: {
        timeout: 500000, // 500 seconds max for running tests
    },
}
