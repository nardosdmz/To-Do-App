import { Route, Router, Routes } from "react-router-dom";
import { useUser } from "./context/UserContext";

import Task from "./components/Task";
import EditTask from "./components/EditTask/EditTask";
import SignUp from "./components/SignUp/SignUp";
import { useEffect } from "react";
import axios from "./components/axios";
import Login from "./components/Login/Login";
import Four04 from "./components/Four04/Four04";

function App() {
	const { userData, setUserData } = useUser();

	// const checkLoggedIN = async () => {
	// 	let token = localStorage.getItem("authtoken");
	// 	try {
	// 		console.log("Token from localStorage:", token);

	// 		if (token === null) {
	// 			token = "";
	// 		} else {
	// 			const userRes = await axios.get("/users", {
	// 				headers: { "x-auth-token": token },
	// 			});
	// 			setUserData({
	// 				token,
	// 				user: {
	// 					id: userRes.data.data.user_id,
	// 					display_name: userRes.data.data.user_name,
	// 				},
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error("Error in checkLoggedIN:", error);
	// 	}
	// };

	// useEffect(() => {
	// checkLoggedIN();
	// }, []);
	useEffect(() => {
		localStorage.setItem("authtoken", "");
	}, []);
	// localStorage.setItem("authtoken", "");
	return (
		<Routes>
			<Route path="/signup" element={<SignUp />} />
			<Route path="/login" element={<Login />} />
			<Route path="/task/:id" element={<EditTask />} />
			<Route path="/" element={<Task />} />
			<Route path="*" element={<Four04 />} />
		</Routes>
	);
}

export default App;
