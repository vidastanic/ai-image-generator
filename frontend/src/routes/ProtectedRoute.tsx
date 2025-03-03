import { Navigate, Outlet } from "react-router";
import {isTokenExpired} from "../utils/auth.ts";
import {CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";

export default function ProtectedRoute() {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const validateToken = async () => {
            if (!token ||isTokenExpired(token)) {
                setIsValid(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/auth/validate", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Invalid token");

                setIsValid(true);
            } catch (error) {
                localStorage.removeItem("token");
                setIsValid(false);
            }
        };

        validateToken();
    }, [token]);

    if (isValid === null) return <CircularProgress />;
    return isValid ? <Outlet /> : <Navigate to="/login" replace />;
}
