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
		// get these from the body (name)
		const { userName, password, password2 } = req.body;
		if (!userName || !password || !password2)
			return res
				.status(400)
				.json({ msg: "Not all fields have been provided " });

		// Check if the username is alredy taken
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
					// if the username is new then go ahead with the registration.
					const salt = bcrypt.genSaltSync();
					const hashedPassword = bcrypt.hashSync(password, salt);
					// Register/ assign password to hashed
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

		try {
			const user = await getUserByUserName(userName);
			if (!user) {
				return res
					.status(404)
					.json({ msg: "No account with this username has been registered" });
			}
			// compare password from dbase to what the user provided
			const isMatch = bcrypt.compareSync(password, user.user_password);

			if (!isMatch) {
				return res.status(400).json({ msg: "Invalid Credentials" });
			}

			const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
				expiresIn: "2h",
			});

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
