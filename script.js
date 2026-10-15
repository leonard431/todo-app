
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

const remainingCount = document.getElementById("remainingCount");
const completedCount = document.getElementById("completedCount");
const progressBar = document.getElementById("progressBar");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedButton = document.getElementById("clearCompleted");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("myTodoTasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(
            task =>
                task &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
        );
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}

let currentFilter = "all";
let nextId = tasks.reduce(
    (max, task) => Math.max(max, Number(task.id) || 0),
    0
) + 1;

function saveTasks() {
    try {
        localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
    } catch (error) {
        console.error("Could not save tasks:", error);
        message.textContent = "Your changes could not be saved in this browser.";
    }
}

function updateSummary() {
    const completed = tasks.filter(task => task.completed).length;
    const remaining = tasks.length - completed;

    remainingCount.textContent = remaining;
    completedCount.textContent = completed;

    const progress = tasks.length
        ? (completed / tasks.length) * 100
        : 0;

    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progressBar.setAttribute("aria-valuenow", Math.round(progress));
}
function getVisibleTasks() {
    if (currentFilter === "active") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function renderTasks() {
    taskList.innerHTML = "";

    const visibleTasks = getVisibleTasks();

    if (visibleTasks.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-state";

        if (tasks.length === 0) {
            emptyItem.textContent =
                "No tasks yet. Add your first task above! ✨";
        } else {
            emptyItem.textContent =
                currentFilter === "active"
                    ? "You're all caught up! 🎉"
                    : "No completed tasks yet.";
        }

        taskList.appendChild(emptyItem);
    }

    visibleTasks.forEach(task => {
        const item = document.createElement("li");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Complete ${task.text}`);

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.setAttribute("aria-label", `Edit ${task.text}`);

        editButton.addEventListener("click", () => {
            const newText = prompt("Edit your task:", task.text);

            if (newText === null) return;

            if (!newText.trim()) {
                alert("Task cannot be empty.");
                return;
            }

            task.text = newText.trim();
            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
            message.textContent = "Task deleted.";
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        item.appendChild(checkbox);
        item.appendChild(text);
        item.appendChild(actions);

        taskList.appendChild(item);
    });

    updateSummary();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        message.textContent = "Please enter a task first.";
        return;
    }

    tasks.push({
        id: nextId++,
        text,
        completed: false
    });

    saveTasks();

    taskInput.value = "";
    currentFilter = "all";

    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === "all"
        );
    });

    renderTasks();
    message.textContent = "Task added successfully!";
    taskInput.focus();
});

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderTasks();
    });
});

clearCompletedButton.addEventListener("click", () => {
    const completedTasks = tasks.filter(task => task.completed).length;

    if (completedTasks === 0) {
        message.textContent = "There are no completed tasks to clear.";
        return;
    }

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

    message.textContent = "Completed tasks cleared.";
});

renderTasks();
