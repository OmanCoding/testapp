var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

let db = require("./utils").db;

// /admin path
router.use(
	"/admin",
	require("./utils").checkUserType("admin"),
	require("./admin")
);

// /user path
router.use(
	"/user",
	require("./utils").checkUserType("user"),
	require("./user")
);

router.get("/", function (req, res, next) {
	res.render("landing", {
		user: makeid(6),
		admin: "_a" + makeid(5),
		...req.query,
	});
});

router.get("/login", function (req, res, next) {
	res.render("login", { ...req.query });
});

router.post("/login", async (req, res, next) => {
	// again here, you would get the username and password from a form in the actual site. Here, we hardcode the values again.
	const username = req.body.username;
	const password = req.body.password;
	const user = await db.userDB.findOne({ username });
	if (user) {
		const matchstatus = await bcrypt.compare(password, user.hashedPw);
		if (matchstatus === true) {
			req.session.user = user;
			return res.redirect(`/${user.type}`);
		}
	}
	return res.redirect("/login?failed=incorrect");
});

router.get("/create/:type/:username", async (req, res, next) => {
	const username = req.params.username;
	let user = await createUser(req.params.type, username);
	return res.redirect(`/?done=${username}`);
});

// one time default user
createUser("admin", "adminuser");

async function createUser(type, username) {
	const hashedPw = await bcrypt.hash(username, 12);
	try {
		const user = await db.userDB.insert({
			username,
			hashedPw,
			needPasswordChange: true,
			type,
		});
		return user;
	} catch (error) {
		console.log(error.message.yellow);
	}
}

router.get("/logout", function (req, res, next) {
	req.session = null;
	res.redirect("/login");
});

function makeid(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
module.exports = router;
