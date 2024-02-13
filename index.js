const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
// require("dotenv").config();

const app = express();
app.use(cors());

// connect DB
const connection = mysql.createConnection({
	host: "localhost",
	user: "pro",
	password: "password",
	database: "labwork",
});

connection.connect((error) => {
	if (error) {
		console.error("Db not connected:", error.message);
	} else {
		console.log("Db connected");
	}
});

app.use(express.json());

// routes

// login route
app.post("/login", async (req, res) => {
	const data = req.body;
	try {
		connection.query(
			"SELECT * FROM user WHERE studentId = ?",
			[data.studentId],
			(error, results) => {
				if (error) {
					console.error("Database error:", error.message);

					res.status(500).send({ message: "Internal Server Error" });
					return;
				}
				if (results.length <= 0) {
					res.status(404).send({ message: "You are not our student!" });
					return;
				}
				if (results[0].password != data.password) {
					res.status(401).send({ message: "Password not Match!" });
				}
				res.status(202).send(results[0]);
			}
		);
	} catch (e) {
		console.log(e.message);

		res.status(500).send({ message: "Internal Server Error" });
	}
});

// registration
app.post("/registration", async (req, res) => {
	const { name, dept, password, phone, studentId } = req.body;

	try {
		const query =
			"INSERT INTO user (name, dept, password, phone,studentId) VALUES (?, ?, ?, ?, ?)";
		connection.query(
			query,
			[name, dept, password, phone, studentId],
			(error, results, fields) => {
				if (error) {
					console.log(error);
				}
			}
		);
		res.send("Your data is inserted!");
	} catch (e) {
		console.log(e.message);
	}
});

// admin route

app.get("/", (req, res) => {
	res.send("Hello World everything is ok!");
});

app.listen(5000);
