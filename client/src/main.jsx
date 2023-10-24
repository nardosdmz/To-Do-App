import React from "react";

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { BrowserRouter } from "react-router-dom";

// css
import "./assets/normalize.css";
import "./assets/main.css";
import "./assets/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<UserProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</UserProvider>
);
