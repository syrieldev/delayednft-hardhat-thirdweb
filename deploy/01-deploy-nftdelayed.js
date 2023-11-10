const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { ThirdwebStorage } = require("@thirdweb-dev/storage")
const fs = require("fs")
const { thirdwebImages, uploadMetadata } = require("../utils/uploadThirdweb")

const imagesLocation = "./images/nft/"
let tokenUris = []

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}

const storage = new ThirdwebStorage({
    secretKey: process.env.THIRDWEB_SECRET_KEY,
})

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let _defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps

    if (process.env.THIRDWEB_UPLOAD == "true") {
        tokenUris = await handleTokenUris(storage)
    }

    if (chainId == 31337) {
        _defaultAdmin = deployer
        _name = "Cat NFT Delayed"
        _symbol = "CAT"
        _royaltyRecipient = deployer
        _royaltyBps = 200
    }

    log("----------------------------------------------------")
    arguments = [_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps]
    const NftDelayed = await deploy("NftDelayed", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(randomIpfsNft.address, arguments)
    }
}

async function handleTokenUris(storage) {
    const imagesUploadResponse = await thirdwebImages(imagesLocation, storage)
    const metadataUploadContents = []
    const metadataUploadNames = []
    console.log(imagesUploadResponse)

    for (let i = 0; i < imagesUploadResponse.length; i++) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = `Cat ${i + 1}`
        tokenUriMetadata.description = `This is the description for Cat ${i + 1}`
        tokenUriMetadata.image = imagesUploadResponse[i]

        metadataUploadContents.push(tokenUriMetadata)
        metadataUploadNames.push(tokenUriMetadata.name)
    }

    const metadataUpload = await storage.uploadBatch(
        metadataUploadContents.map((content) => Buffer.from(JSON.stringify(content)))
    )

    if (metadataUpload && metadataUpload.length > 0) {
        for (let i = 0; i < metadataUpload.length; i++) {
            const metadataGatewayUrl = storage.resolveScheme(metadataUpload[i])
            console.log(`Metadata Gateway URL ${i + 1} - ${metadataGatewayUrl}`)
            tokenUris.push(metadataUpload[i])
        }
    } else {
        console.error(`Error uploading metadata`)
    }

    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]
