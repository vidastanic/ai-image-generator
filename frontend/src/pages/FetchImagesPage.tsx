import {Container, Typography} from "@mui/material";
import FetchImagesController from "../controllers/FetchImagesController.tsx";

export default function FetchImagesPage() {
    return (
        <Container maxWidth="md" sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "90vh",
            gap: "2rem",
            overflow: "hidden",
            marginTop: "2rem",
        }}>
            <Typography variant="h4">Image History</Typography>
            <FetchImagesController />
        </Container>
    )
}
