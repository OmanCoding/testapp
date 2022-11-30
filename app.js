var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/admin");
var colors = require("colors");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var session = require("express-session");
var NedbStore = require("express-nedb-session")(session);

app.use(
	session({
		name: "testapp",
		secret: "4ebd020883285d698c44ec50939c0967",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false, expires: 30 * 24 * 60 * 60 * 1000 },
		store: new NedbStore({ filename: "data/sessions" }),
		unset: "destroy",
	})
);

app.use(function (req, res, next) {
	res.locals.session = req.session.user;
	next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);

var listener = app.listen(8080, function () {
	console.log("Listening on port " + listener.address().port);
});
