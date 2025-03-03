import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI();

export async function generateImageFromTextUtil(prompt: string) {
    try {
        const { data } = await openai.images.generate({
            prompt,
        });
        const imageUrl = data?.[0]?.url; // ? works for both null and undefined!
        if (!imageUrl) throw new Error("Image not generated.");

        return imageUrl;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to generate image from text prompt: ' + (error as Error).message);
        // Remember you can always cast using as - however note that this can still cause runtime errors!
    }
}