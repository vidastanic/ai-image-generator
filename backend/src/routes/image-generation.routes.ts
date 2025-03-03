import Router from "express";
import {generateImageFromText} from "../controllers";

export const router = Router();

router.post('/text_prompt', generateImageFromText);
