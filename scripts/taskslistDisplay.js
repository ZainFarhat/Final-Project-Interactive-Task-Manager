// Get DOM element by Id
var list = document.getElementById("task-list");

function getTasks() {
  var html = "";

  var filteredTask = tasks.filter(function (t) {
    // If the filter is "pending", include only tasks where t.done is false .
    if (currentFilter === "pending") return !t.done;
    // If the filter is "completed", include only tasks where t.done is is true .
    if (currentFilter === "completed") return t.done;
    return true; // If the filter is "all",
  });

  if (filteredTask.length === 0) {
  var msg = "No tasks yet";
  if (currentFilter === "pending") msg = "No pending tasks";
  if (currentFilter === "completed") msg = "No completed tasks";
  list.innerHTML = '<li class="empty">' + msg + '</li>';
  return;
}


  for (var i = 0; i < filteredTask.length; i++) {
    var t = filteredTask[i];
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

// Keep track of which filter is selected right now ("all", "pending", or "completed")
var currentFilter = "all"; 
var buttonAll = document.querySelector(".button-all");
var buttonPending = document.querySelector(".button-pending");
var buttonCompleted = document.querySelector(".button-completed");
var allFilterButtons = document.querySelectorAll(".filter-button");


  function setFilter(name) {
  currentFilter = name;

  allFilterButtons.forEach(function (b) { b.classList.remove("active"); });
//   Add the "active" highlight to the button that matches the chosen filter
  if (name === "all") buttonAll.classList.add("active");
  if (name === "pending") buttonPending.classList.add("active");
  if (name === "completed") buttonCompleted.classList.add("active");

  getTasks();
}


setFilter("all");

// Make the buttons work: when clicked, change the filter
buttonAll.addEventListener("click", function () { setFilter("all"); });
buttonPending.addEventListener("click", function () { setFilter("pending"); });
buttonCompleted.addEventListener("click", function () { setFilter("completed"); });

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


// handle status changes 
list.addEventListener("change", function (e) {

  if (!e.target.classList.contains("toggle")) return;

  var li = e.target.closest("li.task");
  if (!li) return;

  var id = Number(li.getAttribute("data-id"));
  var checked = e.target.checked; // true = done, false = pending

  // update task status
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].done = checked;
      break;
    }
  }

 saveTasks(); // update localStorage
  getTasks(); // updated tasks will be displayed
});
