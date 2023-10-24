import "../DarkMode/DarkMode.css";
import React, { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function DarkMode() {
	const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);

		localStorage.setItem("theme", newTheme);
	};

	useEffect(() => {
		if (theme === "dark") {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	}, [theme]);

	return (
		<>
			<div className="theme-toggle" onClick={toggleTheme}>
				{theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
			</div>
		</>
	);
}

export default DarkMode;
