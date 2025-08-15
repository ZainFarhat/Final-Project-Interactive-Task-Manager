// Get DOM element by Id
var list = document.getElementById("task-list");

function getTasks() {
  var html = "";
  if (tasks.length === 0) {
    html = '<li class="empty">No tasks yet</li>';
    list.innerHTML = html;
    return;
  }

  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    html +=
      '<li class="task ' +
      (t.done ? "done" : "") +
      '" data-id="' +
      t.id +
      '">' +
      '  <div class="left">' +
      '    <input class="toggle" type="checkbox" ' +
      (t.done ? "checked" : "") +
      ' aria-label="Mark complete" />' +
      '    <span class="task-text">' +
      escapeHtml(t.text) +
      "</span>" +
      (t.description
        ? '<p class="task-desc">' + escapeHtml(t.description) + "</p>"
        : "") +
      "  </div>" +
      '  <div class="buttons">' +
      '    <button class="edit-button" type="button">Edit</button>' +
      '    <button class="delete-button" type="button">Delete</button>' +
      "  </div>" +
      "</li>";
  }
  list.innerHTML = html;
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

getTasks();

// Delete Function: it removes task depending on its Id

function deleteTask(id) {
  for (var i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].id === id) {
      tasks.splice(i, 1);
      break;
    }
  }
  saveTasks(); // update localStorage
  getTasks(); // updated tasks will be displayed
}

list.addEventListener("click", function (e) {
  if (!e.target.classList.contains("delete-button")) return;

  var li = e.target.closest("li.task");
  if (!li) return;

  var id = Number(li.getAttribute("data-id"));

  deleteTask(id);
});
