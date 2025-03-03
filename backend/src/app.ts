import express from 'express';
import cors from 'cors';
import {authMiddleware, errorMiddleware, loggerMiddleware} from "./middlewares";
import {authRouter, fetchImagesForUserRouter, imageGeneratorRouter} from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);

app.use('/auth', authRouter);

app.use(authMiddleware);

// Protected Routes:
app.use('/generate_image', imageGeneratorRouter);
app.use('/fetch_images', fetchImagesForUserRouter);


app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
