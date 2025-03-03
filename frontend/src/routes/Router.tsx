import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router";
import ImageGeneratorPage from "../pages/ImageGeneratorPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import FetchImagesPage from "../pages/FetchImagesPage.tsx";
import LayoutPage from "../pages/LayoutPage.tsx";
import SignUpPage from "../pages/SignUpPage.tsx";

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<LayoutPage />}>
                        <Route path={"/image-generator"} element={<ImageGeneratorPage />} />
                        <Route path={"/fetch-images"} element={<FetchImagesPage />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    )
}
