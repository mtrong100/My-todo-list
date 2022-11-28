const form = document.querySelector(".form");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");
const addBtn = document.querySelector(".add-btn");
/* ----------------------------------------------------- */
// tạo todoArray để chứa value cùa input
let todoArray = JSON.parse(localStorage.getItem("todoList") || "[]");
let editId;
let isEditedTask = false;

function showTodo() {
  const todoItem = document.querySelectorAll(".todo-item");
  todoItem.forEach((item) => item.remove());
  // truyền param id vào để lấy ra id của từng template todo
  todoArray.forEach((item, id) => {
    let isCompleted = item.status;
    if (isCompleted == "completed") {
      isCompleted = "checked";
    } else {
      isCompleted = "";
    }
    /* tạo template cần xuất hiện khi add task */
    const template = `<div class="todo-item">
                          <label class="todo-status" id="${id}">
                            <input onclick="updateStatus(this)" type="checkbox" class="check-task" id="${id}" ${isCompleted}>
                            <span class="todo-text ${isCompleted}">${item.title}</span>
                          </label>
                          <span class="icon"> 
                              <i onclick="editTodo(${id}, '${item.title}')" class="fa fa-edit edit"></i>
                              <i onclick="deleteTodo(${id})" class="fa fa-trash delete"></i>
                          </span>
                      </div>`;
    todoList.insertAdjacentHTML("beforeend", template);
    if (todoList.offsetHeight >= 400) {
      todoList.classList.add("overflow");
    } else {
      todoList.classList.remove("overflow");
    }
  });
}
showTodo();

function updateStatus(selectedTask) {
  let taskName = selectedTask.nextElementSibling;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todoArray[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todoArray[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todoList", JSON.stringify(todoArray));
}

function editTodo(editTaskId, taskTitle) {
  editId = editTaskId;
  isEditedTask = true;
  addBtn.textContent = "Save";
  todoInput.value = taskTitle;
}

function deleteTodo(deleteTaskId) {
  // xóa bằng splice(vị trí index của todo, số lượng xóa là 1)
  todoArray.splice(deleteTaskId, 1);
  // cập nhật lại localStorage sau ra xóa
  localStorage.setItem("todoList", JSON.stringify(todoArray));
  showTodo();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  // trim() để xóa các kí tự khoảng trắng dư thừa
  let inputValue = todoInput.value.trim();
  if (!inputValue) return;
  /* MAIN CODE HERE */
  if (!isEditedTask) {
    // tạo mảng todoInfo chứa key và value
    let todoInfo = { title: inputValue, status: "pending" };
    // push todoInfo (gồm key và value) vào todoArray
    todoArray.push(todoInfo);
  } else {
    isEditedTask = false;
    addBtn.textContent = "Add";
    todoArray[editId].title = inputValue;
  }
  // check nếu có localStorage thì lưu vào (localStorage gồm key và value)
  //value lúc này là mảng todoArray sau khi đã được push input value vào
  if (localStorage) localStorage.setItem("todoList", JSON.stringify(todoArray));
  showTodo();
  /* clear input sau khi enter */
  todoInput.value = "";
});
