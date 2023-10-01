const mysql = require("mysql2");
require("dotenv").config();

const connect = mysql.createConnection({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
});

connect.connect((err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log("connected");
	}
});

module.exports = { connect };
