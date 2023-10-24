const router = require("express").Router();

const {
	createTask,
	tasks,
	taskByID,
	updateTask,
	deleteTask,
	overWriteTask,
} = require("./Task.controller");

const auth = require("../middleware/auth.js");

router.post("/", createTask);
router.get("/all-tasks", tasks);
router.get("/task/:id", taskByID);
router.patch("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);
router.put("/task/:id", overWriteTask);

module.exports = router;
