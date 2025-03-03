import {Box, Button, Input, InputLabel, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {isTokenExpired} from "../utils/auth.ts";

interface AuthControllerProps {
    type: "login" | "signup"
}
export default function AuthController({type}: AuthControllerProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!isTokenExpired(token)) {
            console.log("Whats a going on");
            navigate("/image-generator"); // TODO refactor checking backend validation into a reusable utility
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/auth/" + type, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.access_token);
                navigate("/image-generator");
            } else {
                throw new Error(data?.message ?? "Authentication failed");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box component={"form"} onSubmit={handleSubmit}>
            <Stack direction="column" spacing={2}>
                <InputLabel htmlFor={"email-input"}>Email Address</InputLabel>
                <Input required id={"email-input"} value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputLabel htmlFor={"password-input"}>Password</InputLabel>
                <Input required type={"password"} id={"password-input"} value={password} onChange={e => setPassword(e.target.value)} />
                <Button type="submit" variant="contained" color="primary">
                    {type === "login" ? "Log in" : "Sign up"}
                </Button>
                <Button onClick={(_e) => {
                        if (type === "signup") {
                            navigate("/login");
                        } else {
                            navigate("/signup");
                        }
                    }
                }>{type === "login" ? "Sign Up Instead" : "Log In Instead"}</Button>
            </Stack>
        </Box>
    )
}
