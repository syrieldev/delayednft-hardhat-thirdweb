const { ThirdwebStorage } = require("@thirdweb-dev/storage")
const fs = require("fs")
require("dotenv").config()
const path = require("path")

const storage = new ThirdwebStorage({
    secretKey: process.env.THIRDWEB_SECRET_KEY,
})

async function thirdwebImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)

    const files = fs.readdirSync(fullImagesPath).filter((file) => file.endsWith(".png"))

    const fileContents = files.map((file) => fs.readFileSync(path.join(fullImagesPath, file)))

    try {
        const upload = await storage.uploadBatch(fileContents)
        for (let i = 0; i < upload.length; i++) {
            console.log(`Image Gateway URL ${i + 1} - ${storage.resolveScheme(upload[i])}`)
        }
        return upload
    } catch (error) {
        console.error("Error uploading batch:", error)
        return []
    }
}

async function uploadMetadata(metadata) {
    try {
        const metadataUpload = await storage.uploadBatch([Buffer.from(JSON.stringify(metadata))])
        if (metadataUpload && metadataUpload.length > 0) {
            const metadataGatewayUrl = storage.resolveScheme(metadataUpload[0])
            console.log(`Metadata uploaded successfully: ${metadata.name} - ${metadataUpload[0]}`)
            console.log(`Metadata Gateway URL - ${metadataGatewayUrl}`)
            return metadataGatewayUrl
        } else {
            console.error(`Error uploading metadata`)
            return null
        }
    } catch (error) {
        console.error(`Error uploading metadata:`, error)
        return null
    }
}

module.exports = { thirdwebImages, uploadMetadata, storage }
