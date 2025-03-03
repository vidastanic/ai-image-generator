import Router from "express";
import {fetchImagesForUser} from "../controllers";

export const router = Router();

router.get('/', fetchImagesForUser);
