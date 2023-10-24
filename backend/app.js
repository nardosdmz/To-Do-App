console.clear();
require("dotenv").config();
const express = require("express"); // calling express for server
const cors = require("cors"); // for cross origne website
const app = express(); //to create auto server
const port = process.env.PORT;
const userRouter = require("./api/users/user.router");
const TasksRouter = require("./api/Task/Task.router");

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//when a POST request is made to /create/
//with a JSON payload in the request body, express.json() middleware will parse the JSON data and make it available as req.body in the route handler function.

// mysql connection
const { connect } = require("./connect");

app.get("/", (req, res) => {
	res.send("Hello, World");
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/tasks", TasksRouter);

// create task
// app.post("/create", (req, res) => {
// const { user_id, name } = req.body;
// console.log(req.body);
// if (!name) {
// 	return res.status(401).send("please provide data");
// }
// const createTask = `INSERT INTO task (task_name) VALUES ("${name}") `;

// connect.query(createTask, (err, result) => {
// 	if (err) {
// 		console.log(err);
// 		return res.send(err);
// 	} else {
// 		return res.status(201).send("task created");
// 	}
// });

// get all tasks
// app.get("/all-tasks", (req, res) => {
// const allTasks = `SELECT * FROM Task;`;
// connect.query(allTasks, (err, result) => {
// 	if (err) {
// 		return res.status(500).json({ msg: err });
// 	} else {
// 		return res.status(200).json({ result });
// 	}
// });

// get single task
// app.get("/task/:id", (req, res) => {
// const id = req.params.id;

// const singleTask = `SELECT * FROM Task WHERE id ="${id}";`;
// connect.query(singleTask, (err, result) => {
// 	if (err) {
// 		return res.status(500).json({ msg: err });
// 	}

// 	if (result.length < 1) {
// 		return res.status(404).send(`No task with id : ${id}`);
// 	} else {
// 		return res.status(200).json({ result });
// 	}
// });

// update task
// app.patch("/task/:id", (req, res) => {
// 	const id = req.params.id;
// 	console.log(id);
// 	let name = req.body.name;
// 	let completed = req.body.completed;

// 	if (completed) {
// 		completed = 1;
// 	}
// 	console.log(req.body);

// 	const updateTask = `UPDATE task
// 	SET ${name ? `task_name = "${name}",` : ""}
// 		completed = ${completed}
// 		WHERE id=${id}`;
// 	console.log(updateTask);

// 	connect.query(updateTask, (err, result) => {
// 		if (err) {
// 			console.log(err);
// 			return res.send(err.message);
// 		} else {
// 			if (result.affectedRows == 0) {
// 				return res.status(404).send(`No task with id : ${id}`);
// 			}
// 			const singleTask = `SELECT * FROM Task WHERE id =${id};`;
// 			connect.query(singleTask, (err, result) => {
// 				if (err) {
// 					return res.status(500).json({ msg: err });
// 				} else {
// 					return res.status(200).json({ result });
// 				}
// 			});
// 		}
// 	});
// });

/////////////////////////// Delete
// app.delete("/task/:id", (req, res) => {
// 	// Syntax:
// 	//             DELETE FROM table_name WHERE condition;

// 	const id = req.params.id;
// 	let removeTask = `DELETE FROM Task WHERE id = ${id} `;

// 	connect.query(removeTask, (err, result) => {
// 		if (err) {
// 			console.log("Eroor");
// 			return res.send(err.message);
// 		} else {
// 			if (result.affectedRows == 0) {
// 				return res.status(404).send(`No task with id ${id} found`);
// 			}
// 			return res.status(200).send(` Task ${id} Deleted`);
// 		}
// 	});
// });

app.listen(port, (err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log(`http://localhost:${port}`);
	}
});
