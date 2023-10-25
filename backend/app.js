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
app.use(express.json()); // when a POST request is made to / this parse the JSON data and make it available as req.body in the route handler function.


// mysql connection
const { connect } = require("./connect");

app.get("/", (req, res) => {
	res.send("Hello, World");
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/tasks", TasksRouter);

app.listen(port, (err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log(`http://localhost:${port}`);
	}
});
