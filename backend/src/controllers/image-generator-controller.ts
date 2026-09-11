import { randomUUID } from 'node:crypto';
import { NextFunction, Response } from 'express';
import { z } from 'zod';
import { generateImageFromTextUtil } from '../utils/openai-utils';
import { uploadImageFromUrl, deleteImageObject } from '../utils/s3-utils';
import { AuthenticatedRequest } from '../types';
import { db } from '../config/database';
import { images } from '../db/schema';

export const generateImageFromText = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let uploadedKey: string | undefined;
    try {
        const { prompt } = z.object({ prompt: z.string().trim().min(1).max(4000) }).parse(req.body);
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required' });
            return;
        }
        const generatedImageUrl = await generateImageFromTextUtil(prompt);
        const imageId = randomUUID();
        // Keep the existing object naming convention so gallery reads remain compatible.
        const key = `v1/prod/generated/${req.user.id}/${imageId}.png`;
        await uploadImageFromUrl(generatedImageUrl, key);
        uploadedKey = key;
        await db.insert(images).values({ id: imageId, userId: req.user.id, imageType: 'generated' });
        // At this point both the object and its gallery record exist.
        uploadedKey = undefined;
        res.json({ success: true, generatedImageUrl });
    } catch (error) {
        if (uploadedKey) {
            try {
                await deleteImageObject(uploadedKey);
            } catch (cleanupError) {
                // Preserve the original failure; operators can remove this unreferenced object.
                console.error('Failed to clean up unreferenced image', uploadedKey, cleanupError);
            }
        }
        next(error);
    }
};
