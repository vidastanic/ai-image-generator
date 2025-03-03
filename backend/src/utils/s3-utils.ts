import dotenv from "dotenv";
import {S3Client, PutObjectCommand, GetObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
const mime = require('mime-types')

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
});

export async function uploadImageFromUrl(imageUrl: string, fileKey: string) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch image: ' + response.statusText);
        }
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        const contentType = response.headers.get("content-type") || "image/png"

        const extension = mime.extension(contentType);

        // Set up S3 upload parameters
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${fileKey}.${ extension }`,
            Body: imageBuffer,
            ContentType: contentType
        };

        // Upload to S3
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("Upload Success", data);
        return data;
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
}

export async function fetchImagesByUser(imageIds: string[], fileKey: string) {
    const fetchParams = (imageId: string) => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${fileKey}/${imageId}.png`,
        };
    }

    return await Promise.all(imageIds.map(async imageId => {
        const getObjectCommand = new GetObjectCommand(fetchParams(imageId));
        return await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 });
    }));
}
