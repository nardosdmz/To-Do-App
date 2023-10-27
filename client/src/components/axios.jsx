import axios from "axios";

const instance = axios.create({
	// baseURL: "https://to-do-app-crud.onrender.com/api/",
	baseURL: "http://localhost:5000/api",
});

export default instance;
