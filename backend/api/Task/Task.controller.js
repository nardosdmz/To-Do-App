const { connect } = require("../../connect");
const { postTask, getAllTasks } = require("./Task.service");

module.exports = {
	createTask: (req, res) => {
		const { userId, taskName } = req.body;

		if (!taskName) {
			return res.status(400).json({ message: "Please provide task data" });
		}

		postTask({ userId, taskName }, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: "Task creation failed" });
			}
			// if everything is ok send message and assign the result to the word "data"

			return res.status(201).json({ message: "Task created", data: result });
		});
	},

	tasks: (req, res) => {
		const userId = req.query.user_id;
		// getting the userId from the query like http://theurl.com/router?user_id=123,
		if (!userId) {
			return res
				.status(400)
				.json({ msg: "userId is missing in the query parameters" });
		}

		getAllTasks({ userId }, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "Database connection error" });
			}
			return res.status(200).json({ data: result });
		});
	},

	taskByID: (req, res) => {
		const user_id = req.query.user_id;
		const id = req.params.id; //ex user sent /user/123
		const singleTask = `SELECT * FROM task WHERE id = ? AND user_id = ?`;

		connect.query(singleTask, [id, user_id], (error, results) => {
			if (error) {
				return res.status(500).json({ msg: error });
			}
			if (results.length < 1) {
				return res.status(404).send(`No task with id: ${id}`);
			} else {
				return res.status(200).json(results);
			}
		});
	},

	updateTask: (req, res) => {
		const id = req.params.id; // the id is dynamic depending on what the user selected
		const user_id = req.query.user_id;
		const { taskName, completed, dueDate } = req.body;
		// console.log(req.body, "tasks to be updated");

		//select from dbase to check if the data already exsits before updating
		connect.query(
			`SELECT task_name, completed ${
				dueDate ? ", due_date" : ""
			} FROM task WHERE id = ? AND user_id = ?`,
			[id, user_id],
			(selectError, selectResults) => {
				if (selectError) {
					console.log(selectError);
					return res.status(500).json({ message: "Task update failed" });
				}

				if (selectResults.length === 0) {
					return res
						.status(404)
						.send(`No task with id: ${id} for user with user_id: ${user_id}`);
				}

				//compare the existing data with tht new one
				const existingTask = selectResults[0];
				// console.log(existingTask, "existing task before");
				if (
					existingTask.task_name === taskName &&
					existingTask.completed === completed &&
					existingTask.due_date === dueDate
				) {
					return res.status(200).json({
						message: "Task data is the same as the previous value",
					});
				}

				// If data is different, continue update
				const updateTask = `UPDATE task
		SET ${taskName ? `task_name = ?,` : ""}
		completed = ? ${dueDate ? `, due_date = ?` : ""}
		WHERE id = ? AND user_id = ?`;
				const values = [
					taskName,
					completed,
					...(dueDate ? [dueDate] : []),
					id,
					user_id,
				];
				connect.query(updateTask, values, (error, results) => {
					if (error) {
						console.log(error);
						return res.status(500).json({ message: "Task update failed" });
					}
					const singleTask = `SELECT * FROM task WHERE id = ? AND user_id = ?`;
					connect.query(singleTask, [id, user_id], (err, result) => {
						if (err) {
							return res.status(500).json({ message: err });
						}
						return res.status(200).json({ result });
					});
				});
			}
		);
	},

	replaceTask: (req, res) => {
		const id = req.params.id;
		const user_id = req.query.user_id;

		// update the task to set due_date to null
		const updateQuery =
			`UPDATE task SET due_date = NULL WHERE id = ? AND user_id = ?`;

		connect.query(updateQuery, [id, user_id], (err, result) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: "Failed to update due date" });
			} else {
				res.status(200).json({ message: "Due date deleted successfully" });
			}
		});
	},

	deleteTask: (req, res) => {
		const id = req.params.id;
		const removeTask = `DELETE FROM task WHERE id =${id}`;
		connect.query(removeTask, (error, result) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Task deletion failed" });
			}
			if (result.affectedRows === 0) {
				return res.status(404).send(`No task with id ${id} found`);
			}
			return res.status(200).send(`Task ${id} Deleted`);
		});
	},
};
