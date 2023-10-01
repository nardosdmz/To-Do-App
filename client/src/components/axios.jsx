import axios from "axios";

const instance = axios.create({
	// baseURL: "https://fluffy-trench-coat-hen.cyclic.app/",
	// baseURL: "https://to-do-app-crud.onrender.com",
	baseURL: "http://localhost:5000",
});

export default instance;
