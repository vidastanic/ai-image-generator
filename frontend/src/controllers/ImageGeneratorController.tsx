import {Box, Button, CircularProgress, Stack, TextField} from "@mui/material";
import {useState} from "react";
import {apiFetch} from "../utils/api-fetch.ts";
import {useNavigate} from "react-router";

export default function ImageGeneratorController() {
    const [input, setInput] = useState<string>("");
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiFetch("http://localhost:3000/generate_image/text_prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({prompt: input}),
            });
            const jsonResponse = await response.json();
            const imageUrl = jsonResponse.generatedImageUrl;
            setGeneratedImageUrl(imageUrl);
            // setInput("");
        } catch (error) {
            console.error(error);
            navigate("/login");
        }
        setLoading(false);
    }

    return (
        <Stack direction="column" spacing={2} component={"form"} onSubmit={handleSubmit} width={"70%"}>
            <TextField
                label="Type your image prompt here!"
                multiline
                minRows={4}
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        handleSubmit(e);
                    }
                }}
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
            {generatedImageUrl === null || loading ? <Box height={"20vh"} display={"flex"} justifyContent={"center"} alignItems={"center"}>{loading && <CircularProgress color={"secondary"} size={"7rem"}/>}</Box> : <img src={generatedImageUrl} style={{width: "auto", height: "20vh", objectFit: "contain"}} />}
        </Stack>
    )
}
