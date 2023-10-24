const { connect } = require("../../connect");

module.exports = {
	postTask: (data, callback) => {
		connect.query(
			`INSERT INTO task ( user_id, task_name) VALUES (?, ?)`,
			[data.userId, data.taskName],
			(err, result) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, result);
			}
		);
	},

	getAllTasks: (data, callback) => {
		connect.query(
			"SELECT * FROM task WHERE user_id = ?",
			[data.userId],
			(err, result) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, result);
			}
		);
	},
};
