import {NextFunction, Response} from 'express';
import {fetchImagesByUser} from '../utils';
import {AuthenticatedRequest} from "../types";
import {db} from "../config/database";
import {images} from "../db/schema";
import {desc, eq} from "drizzle-orm";

export const fetchImagesForUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const fetchedImages = await db.select({imageId: images.id}).from(images).where(eq(images.userId, req.user!.id)).orderBy(desc(images.createdAt));

        const imageUrls = await fetchImagesByUser(fetchedImages.map(({imageId}) => imageId), `v1/prod/generated/${req.user!.id}`);

        res.json({
            success: true,
            imageUrls: imageUrls
        })
    } catch (error) {
        next(error);
    }
}
