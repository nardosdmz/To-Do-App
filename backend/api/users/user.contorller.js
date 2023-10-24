const { connect } = require("../../connect");
const {
	register,
	getAllUsers,
	userById,
	getUserByUserName,
} = require("./user.service");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { get } = require("./user.router");
module.exports = {
	createUser: (req, res) => {
		const { userName, password, password2 } = req.body;
		// console.log(req.body);
		if (!userName || !password || !password2)
			return res
				.status(400)
				.json({ msg: "Not all fields have been provided " });

		if (password.length < 8)
			return res
				.status(400)
				.json({ msg: "Password must be at least 8 characters long." });

		connect.query(
			"SELECT * FROM users WHERE user_name = ?",
			[userName],
			(err, results) => {
				if (err) {
					return res.status(500).json({ msg: "Database connection error" });
				}

				if (results.length > 0) {
					return res
						.status(400)
						.json({ msg: "Username taken. Please choose another Username." });
				} else {
					const salt = bcrypt.genSaltSync();
					const hashedPassword = bcrypt.hashSync(password, salt);
					console.log(password);
					console.log(hashedPassword);
					console.log(req.body);

					register({ userName, password: hashedPassword }, (err, result) => {
						if (err) {
							console.log(err);
							return res.status(500).json({ msg: "Database connection error" });
						}
						return res
							.status(200)
							.json({ msg: "New user added successfully", data: results });
					});
				}
			}
		);
	},
	// createUser: async (req, res) => {
	// 	try {
	// 		const { userName, password, password2 } = req.body;

	// 		if (!userName || !password || !password2)
	// 			return res
	// 				.status(400)
	// 				.json({ msg: "Not all fields have been provided " });

	// 		if (password.length < 8)
	// 			return res
	// 				.status(400)
	// 				.json({ msg: "Password must be at least 8 characters long." });

	// 		// Assuming that connect.query is asynchronous, you can await it
	// 		const results = await new Promise((resolve, reject) => {
	// 			connect.query(
	// 				"SELECT * FROM users WHERE user_name = ?",
	// 				[userName],
	// 				(err, results) => {
	// 					if (err) {
	// 						reject(err);
	// 					} else {
	// 						resolve(results);
	// 					}
	// 				}
	// 			);
	// 		});

	// 		if (results.length > 0) {
	// 			return res
	// 				.status(400)
	// 				.json({ msg: "Username taken. Please choose another Username." });
	// 		}

	// 		const salt = bcrypt.genSaltSync();
	// 		const hashedPassword = bcrypt.hashSync(password, salt);

	// 		// Assuming register is asynchronous, you can await it
	// 		await new Promise((resolve, reject) => {
	// 			register({ userName, password: hashedPassword }, (err, result) => {
	// 				if (err) {
	// 					reject(err);
	// 				} else {
	// 					resolve(result);
	// 				}
	// 			});
	// 		});

	// 		return res
	// 			.status(200)
	// 			.json({ msg: "New user added successfully", data: results });
	// 	} catch (error) {
	// 		console.error("Error in createUser:", error);
	// 		return res.status(500).json({ msg: "Internal Server Error" });
	// 	}
	// },
	getUsers: (req, res) => {
		getAllUsers((err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "database connection err" });
			}
			return res.status(200).json({ data: result });
		});
	},

	getUserById: (req, res) => {
		userById(req.id, (err, results) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "database connection err" });
			}
			if (!results) {
				return res.status(404).json({ msg: "Record not found" });
			}
			return res.status(200).json({ data: results });
		});
	},

	login: async (req, res) => {
		const { userName, password } = req.body;
		// console.log(req.body);

		// if (!userName || !password) {
		// 	return res.status(400).json({ msg: "Not all fields have been provided" });
		// }

		try {
			const user = await getUserByUserName(userName);
			console.log(user, "huhuhuhu");
			if (!user) {
				return res
					.status(404)
					.json({ msg: "No account with this username has been registered" });
			}

			const isMatch = bcrypt.compareSync(password, user.user_password);
			
			if (!isMatch) {
				return res.status(400).json({ msg: "Invalid Credentials" });
			}
			// console.log(isMatch);
			const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
				expiresIn: "3h",
			});
			// console.log(token);
			// console.log(userName, password);

			return res.json({
				token,
				user: { id: user.user_id, display_name: user.user_name },
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ msg: "Server error" });
		}
	},
};
