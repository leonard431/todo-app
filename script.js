let todoInput = document.getElementById("todoInput");
let addButton = document.getElementById("addButton");
let todoList = document.getElementById("todoList");


function addTodo() {

    let todoText = todoInput.value.trim();

    if (todoText === "") {
        alert("Please enter a to-do.");
        return;
    }

    let todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    let text = document.createElement("span");
    text.textContent = todoText;
    text.classList.add("todo-text");

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("todo-buttons");


    let completeButton = document.createElement("button");
    completeButton.textContent = "Complete";

    completeButton.addEventListener("click", function() {
        todoItem.classList.toggle("completed");
    });


    let editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", function() {

        let newText = prompt("Update your to-do:", text.textContent);

        if (newText !== null && newText.trim() !== "") {
            text.textContent = newText.trim();
        }

    });


    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
        todoItem.remove();
    });


    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    todoItem.appendChild(text);
    todoItem.appendChild(buttonContainer);

    todoList.appendChild(todoItem);

    todoInput.value = "";
}


addButton.addEventListener("click", addTodo);


todoInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTodo();
    }

});