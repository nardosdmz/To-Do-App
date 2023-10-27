const { pool } = require("../../connect");

module.exports = {
	register: (data, callback) => {
		pool.query(
			`INSERT INTO users(user_name, user_password) VALUES (?, ?)`,
			[data.userName, data.password],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result);
			}
		);
	},

	userById: (id, callback) => {
		pool.query(
			`SELECT users.user_id, user_name FROM users WHERE users.user_id = ?`,
			[id],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result[0]);
			}
		);
	},

	getUserByUserName: (userName) => {
		return new Promise((resolve, reject) => {
			pool.query(
				`SELECT * FROM users WHERE user_name = ?`,
				[userName],
				(err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result[0]);
					}
				}
			);
		});
	},

	getAllUsers: (callback) => {
		pool.query(
			`SELECT user_id, user_name, user_password FROM users`,
			[],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result);
			}
		);
	},
};
