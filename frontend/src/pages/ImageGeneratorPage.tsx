import {Container, Typography} from "@mui/material";
import ImageGeneratorController from "../controllers/ImageGeneratorController.tsx";

export default function ImageGeneratorPage() {
    return (
        <Container disableGutters maxWidth="md" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "90vh",
            gap: "2rem",
            overflow: "hidden",
        }}>
            <Typography variant="h4">AI Image Generator</Typography>
            <ImageGeneratorController />
        </Container>
    )
}
