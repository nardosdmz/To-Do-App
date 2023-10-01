console.clear();
const express = require("express"); // calling express for server
const cors = require("cors"); // for cross origne website
const app = express(); //to create auto server
const port = 5000;
app.use(cors());
// mysql connection
const { connect } = require("./connect");


app.get("/", (req, res) => {
	res.send("Hello, World");
});
// table schema
app.get("/install", (req, res) => {
	const installTable = `CREATE TABLE if not exists Task (
    id INT NOT NULL AUTO_INCREMENT,
	task_name VARCHAR(255),
	completed BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
) `;
	connect.query(installTable, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.send("table create");
		}
	});
});

app.use(express.json());
//when a POST request is made to /create/
//with a JSON payload in the request body, express.json() middleware will parse the JSON data and make it available as req.body in the route handler function.

// create task
app.post("/create", (req, res) => {
	const name = req.body.name;
	console.log(req.body);
	if (!name) {
		return res.status(401).send("plese provide data");
	}
	const createTask = `INSERT INTO task (task_name) VALUES ("${name}") `;

	connect.query(createTask, (err, result) => {
		if (err) {
			console.log(err);
			return res.send(err);
		} else {
			return res.status(201).send("task created");
		}
	});
});

// get all tasks
app.get("/all-tasks", (req, res) => {
	const allTasks = `SELECT * FROM Task;`;
	connect.query(allTasks, (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		} else {
			return res.status(200).json({ result });
		}
	});
});

// get single task
app.get("/task/:id", (req, res) => {
	const id = req.params.id;
	// console.log(id);
	const singleTask = `SELECT * FROM Task WHERE id ="${id}";`;
	connect.query(singleTask, (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		}

		if (result.length < 1) {
			return res.status(404).send(`No task with id : ${id}`);
		} else {
			return res.status(200).json({ result });
		}
	});
});

// update task
app.patch("/task/:id", (req, res) => {
	const id = req.params.id;
	console.log(id);
	let name = req.body.name;
	let completed = req.body.completed;

	if (completed) {
		completed = 1;
	}
	console.log(req.body);

	const updateTask = `UPDATE task
	SET ${name ? `task_name = "${name}",` : ""}
		completed = ${completed}
		WHERE id=${id}`;
	console.log(updateTask);

	connect.query(updateTask, (err, result) => {
		if (err) {
			console.log(err);
			return res.send(err.message);
		} else {
			if (result.affectedRows == 0) {
				return res.status(404).send(`No task with id : ${id}`);
			}
			const singleTask = `SELECT * FROM Task WHERE id =${id};`;
			connect.query(singleTask, (err, result) => {
				if (err) {
					return res.status(500).json({ msg: err });
				} else {
					return res.status(200).json({ result });
				}
			});
		}
	});
});

/////////////////////////// Delete
app.delete("/task/:id", (req, res) => {
	// Syntax:
	//             DELETE FROM table_name WHERE condition;

	const id = req.params.id;
	let removeTask = `DELETE FROM Task WHERE id = ${id} `;

	connect.query(removeTask, (err, result) => {
		if (err) {
			console.log("Eroooooooooooooor");
			return res.send(err.message);
		} else {
			if (result.affectedRows == 0) {
				return res.status(404).send(`No task with id ${id} found`);
			}
			return res.status(200).send(` Task ${id} Deleted`);
		}
	});
});

app.listen(port, (err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log(`http://localhost:${port}`);
	}
});
