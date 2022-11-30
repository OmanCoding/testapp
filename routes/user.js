var express = require("express");
var router = express.Router();

//localhost:8080/create/user/user3
let db = require("./utils").db;

/* GET users listing. */
router.get("/", async function (req, res, next) {
	res.render("user/home", {
		tasks: await db.taskDB.find({ user: req.session.user.username }),
	});
});

router.get("/markdone/task/:taskid", async function (req, res, next) {
	await db.taskDB.updateOne(
		{ _id: req.params.taskid },
		{ $set: { done: true } }
	);
	res.send("ok");
});

module.exports = router;
