var express = require("express");
var router = express.Router();

//localhost:8080/create/user/user3
let db = require("./utils").db;

/* GET users listing. */
router.get("/", async function (req, res, next) {
	let tasks = await db.taskDB.find();
	let groupedTasks = {};
	for (var task of tasks) {
		if (!groupedTasks[task.user]) groupedTasks[task.user] = [];
		groupedTasks[task.user].push(task);
	}
	res.render("admin/home", {
		users: await db.userDB.find({ type: "user" }),
		tasks: groupedTasks,
	});
});

router.post("/add/task", async function (req, res, next) {
	await db.taskDB.insert({ ...req.body, done: false });
	res.redirect("/admin");
});

router.get("/listusers", async function (req, res, next) {
	let users = await db.userDB.find({});
	res.render("admin/listusers", { users });
});

module.exports = router;
