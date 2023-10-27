const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	connectionLimit: 10,
});

pool.getConnection((err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log("connected");
	}
	let users = `CREATE TABLE if not exists users (
    user_id int auto_increment,
    user_name varchar(255) not null,
    user_password varchar(255) not null,
    PRIMARY KEY (user_id)
  )`;


	const installTable = `CREATE TABLE if not exists task (
  id INT NOT NULL AUTO_INCREMENT,
  user_id int not null,
  task_name VARCHAR(255),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  due_date DATETIME, 
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)`;

	pool.query(users, (err, results) => {
		if (err) throw err;
		console.log("Users table created");
	});

	pool.query(installTable, (err) => {
		if (err) throw err;
		console.log("Task table created");
	});
});

module.exports = { pool };
