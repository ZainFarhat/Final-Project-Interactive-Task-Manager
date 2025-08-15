
// Get tasks from Local Storage
var taskLists = localStorage.getItem("TASKS_ARRAY") || "[]";
var tasks = JSON.parse(taskLists);

// Get DOM element by Id
var form = document.getElementById("task-form");
var input = document.getElementById("task-input");
var inputDescription = document.getElementById("task-desc");
var titleError = document.getElementById("title-error");
var descError = document.getElementById("desc-error");

// Save Items in Local Storage
function saveTasks() {
  localStorage.setItem("TASKS_ARRAY", JSON.stringify(tasks));
}

// Add Tasks Functionality
form.addEventListener("submit", function (e) {
  e.preventDefault();
  var inputValue = input.value.trim();
  var descriptionValue = inputDescription.value.trim();
  var hasError = false;

  // Reset errors
  input.classList.remove("field-error");
  inputDescription.classList.remove("field-error");
  titleError.classList.add("hide");
  descError.classList.add("hide");

  // Check if title and description are empty
  if (!inputValue) {
    input.classList.add("field-error");
    titleError.innerText = "Title cannot be empty";
    titleError.classList.remove("hide");
    hasError = true;
  }

  if (!descriptionValue) {
    inputDescription.classList.add("field-error");
    descError.innerText = "Description cannot be empty";
    descError.classList.remove("hide");
    hasError = true;
  }

  if (hasError) {
    return;
  }
  addTask(inputValue, descriptionValue);
  input.value = "";
  inputDescription.value = "";
});

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}



// === Actions ===
function addTask(text, description) {
  var task = {
    id: Date.now(),
    text: text.trim(),
    description: description.trim(),
    done: false,
  };
  tasks.push(task);
  saveTasks();
  getTasks();
}


