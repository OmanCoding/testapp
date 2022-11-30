function markTask(taskid) {
	fetch(`/user/markdone/task/${taskid}`).then((data) => makeTick(taskid));
}

function makeTick(id) {
	let element = document.getElementById(id);
	element.innerHTML = "✅";
}
