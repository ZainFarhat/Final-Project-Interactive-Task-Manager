
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
      '<li class="task ' + (t.done ? 'done' : '') + '" data-id="' + t.id + '">' +
      '  <div class="left">' +
      '    <input class="toggle" type="checkbox" ' + (t.done ? 'checked' : '') + ' aria-label="Mark complete" />' +
      '    <span class="task-text">' + escapeHtml(t.text) + '</span>' +
      (t.description ? '<p class="task-desc">' + escapeHtml(t.description) + '</p>' : '') +
      '  </div>' +
      '  <div class="buttons">' +
      '    <button class="edit-button" type="button">Edit</button>' +
      '    <button class="delete-button" type="button">Delete</button>' +
      '  </div>' +
      '</li>';
  }
  list.innerHTML = html;
}


getTasks();
