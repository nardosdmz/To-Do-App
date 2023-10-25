const router = require("express").Router();

const {
	createTask,
	tasks,
	taskByID,
	updateTask,
	deleteTask,
	replaceTask,
} = require("./Task.controller");

const auth = require("../middleware/auth.js");

router.post("/", createTask);
router.get("/all-tasks", tasks);
router.get("/task/:id", taskByID);
router.patch("/task/:id", updateTask);
router.put("/task/:id", replaceTask);
router.delete("/task/:id", deleteTask);

module.exports = router;
