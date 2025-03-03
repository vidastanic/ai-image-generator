import {Outlet, useNavigate} from "react-router";
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import {useState} from "react";
import FolderIcon from '@mui/icons-material/Folder';
import ElectricBolt from "@mui/icons-material/ElectricBolt";

export default function LayoutPage() {
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();
    const pages = ["/image-generator", "/fetch-images"];

    return (
        <>
            <Outlet />
            <BottomNavigation
                showLabels
                value={tabValue}
                onChange={(_event, newValue) => {
                    setTabValue(newValue);
                    navigate(pages[newValue]);
                }}
            >
                <BottomNavigationAction label="Generate" icon={<ElectricBolt />} />
                <BottomNavigationAction label="History" icon={<FolderIcon />} />
            </BottomNavigation>
        </>
    )
}
