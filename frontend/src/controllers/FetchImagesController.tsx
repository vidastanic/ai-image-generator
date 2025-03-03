import {CircularProgress, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {apiFetch} from "../utils/api-fetch.ts";

export default function FetchImagesController() {
    const [generatedImageUrls, setGeneratedImageUrls] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchImageUrls = async () => {
            try {
                const response = await apiFetch("http://localhost:3000/fetch_images");
                const jsonResponse = await response.json();
                setGeneratedImageUrls(jsonResponse.imageUrls);
            } catch (error) {
                console.error(error);
            }
        }
        fetchImageUrls();
    }, [])

    return (
        <Stack direction="column" spacing={2} overflow="auto" width={"70%"} height={"90%"} alignItems="center">
            {generatedImageUrls === null ? <CircularProgress /> : generatedImageUrls.length === 0 ? <Typography>No Images Generated Yet!</Typography> : generatedImageUrls.map((generatedImageUrl) => {
                    return <img key={generatedImageUrl} src={generatedImageUrl} style={{width: "auto", height: "20rem", objectFit: "contain"}}/>
                })
            }
        </Stack>
    )
}
