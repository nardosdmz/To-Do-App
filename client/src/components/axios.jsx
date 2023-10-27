import axios from "axios";

const instance = axios.create({
	baseURL: "https://to-do-app-crud.onrender.com/api/",
});

export default instance;
