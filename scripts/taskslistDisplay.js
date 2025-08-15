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
      '  <div class="task-main">' +
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

// Edit Function : turns the task text into an input field

function Edit(li) {
  var main = li.querySelector(".task-main");
  var titleSpan = main.querySelector(".task-text");
  var descP = main.querySelector(".task-desc");
  var buttons = li.querySelector(".buttons");

  // Create an input for the title
  var titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className = "edit-title";
  titleInput.value = titleSpan ? titleSpan.textContent : "";

  // Create a textarea for the description
  var descInput = document.createElement("textarea");
  descInput.className = "edit-desc";
  descInput.value = descP ? descP.textContent : "";

  if (titleSpan) titleSpan.replaceWith(titleInput);
  else main.prepend(titleInput);
  if (descP) descP.replaceWith(descInput);
  else main.appendChild(descInput);

  // Change the "Edit" button into a new "Save" button
  var editBtn = buttons.querySelector(".edit-button");
  var saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "save-button";
  saveBtn.textContent = "Save";
  editBtn.replaceWith(saveBtn);
}

// Save Function : Save the edits

function saveEdit(li, id) {
  var titleInput = li.querySelector(".edit-title");
  var descInput = li.querySelector(".edit-desc");

  //trim removes white spacing
  var newTitle = titleInput ? titleInput.value.trim() : "";
  var newDesc = descInput ? descInput.value.trim() : "";

  // If the title box is empty, show an error and stop the function
  if (!newTitle) {
    titleInput.classList.add("field-error");
    return;
  }

  // Look through the tasks, find the one with this id, and update its properties
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].text = newTitle;
      tasks[i].description = newDesc;
      break;
    }
  }
  saveTasks();
  getTasks();
}

list.addEventListener("click", function (e) {
  var li = e.target.closest("li.task");
  if (!li) return;
  var id = Number(li.getAttribute("data-id"));
  //  it will trigger edit function if the edit button was clicked
  if (e.target.classList.contains("edit-button")) {
    Edit(li);
    return;
  }
  // it will save the changes in case save button was clicked
  if (e.target.classList.contains("save-button")) {
    saveEdit(li, id);
    return;
  }
});
