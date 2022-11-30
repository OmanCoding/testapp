const Datastore = require("nedb-promises");

let db = init();
module.exports.db = db;

function init() {
	return {
		userDB: userLoad(),
		taskDB: taskLoad(),
	};
}

function userLoad() {
	return createDataStore("data/users.json", {
		index: {
			fieldName: "username",
			unique: true,
		},
	});
}
function taskLoad() {
	return createDataStore("data/tasks.json");
}

function createDataStore(file, options) {
	let dbObject = new Datastore({
		filename: file,
		timestampData: true,
		autoload: true,
	});
	if (options) {
		dbObject.ensureIndex(options.index, function (err) {
			console.error(err);
		});
	}
	return dbObject;
}

module.exports.checkUserType = function (type) {
	return function (req, res, next) {
		if (req.session) {
			if (req.session.user && req.session.user.type == type) {
				return next();
			}
		}
		return res.status(401).send("Unauthorized");
	};
};
