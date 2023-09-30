import { Route, Routes } from "react-router-dom";
import Task from "./components/Task";
import EditTask from "./components/EditTask";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Task />} />
			<Route path="/task/:id" element={<EditTask />} />
		</Routes>
	);
}

export default App;
