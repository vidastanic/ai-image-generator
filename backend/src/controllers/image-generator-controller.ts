import {NextFunction, Response} from 'express';
import {generateImageFromTextUtil, uploadImageFromUrl} from '../utils';
import {AuthenticatedRequest} from "../types";
import {db} from "../config/database";
import {images} from "../db/schema";
import {z} from "zod";

export const generateImageFromText = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const bodySchema = z.object({
            prompt: z.string().min(1)
        });

        const { prompt } = bodySchema.parse(req.body);

        const generatedImageUrl = await generateImageFromTextUtil(prompt);

        const insertedImages = await db.insert(images).values({userId: req.user!.id, imageType: 'generated'}).returning({imageId: images.id});

        res.json({
            success: true,
            generatedImageUrl
        });

        await uploadImageFromUrl(generatedImageUrl, `v1/prod/generated/${req.user?.id}/${insertedImages[0].imageId}`);
    } catch (error) {
        next(error);
    }
}
