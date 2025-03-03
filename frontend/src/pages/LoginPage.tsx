import {Container, Typography} from "@mui/material";
import AuthController from "../controllers/AuthController.tsx";

export default function LoginPage() {
    return (
        <Container sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "2rem",
        }}>
            <Typography variant="h4">Log In</Typography>
            <AuthController type={"login"} />
        </Container>
    )
}
