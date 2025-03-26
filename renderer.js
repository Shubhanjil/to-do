const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    const taskContainer = document.getElementById("task-container");
    const addTaskButton = document.getElementById("add-task");
    const clearAllButton = document.getElementById("clear-all");

    // Request todos when app loads
    ipcRenderer.send("request-todos");

    ipcRenderer.on("load-todos", (event, todos) => {
        console.log("Loaded todos", todos);
        taskContainer.innerHTML = "";
        todos.forEach(todo => addTodoToIndex(todo));
    });

    const closeBtn = document.getElementById("close-btn");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            window.close(); // Close the window
        });
    }

    function createTask(taskText = "", completed = false) {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        checkbox.checked = completed;

        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("task-input");
        input.placeholder = "New task...";
        input.value = taskText;

        const colors = [
            "#7BDFF2", // Bright Sky Blue  
            "#FF9AA2", // Warm Coral Pink  
            "#FFB7B2", // Soft Peach Pink  
            "#FFDAC1", // Light Apricot  
            "#B5EAD7", // Fresh Mint Green  
            "#9EE37D", // Vibrant Pastel Green  
            "#FF9CEE", // Light Magenta  
            "#FFCB77", // Warm Golden Yellow  
            "#A4E5E0", // Soft Aqua  
            "#F7A8A0", // Rosy Pastel  
            "#FFC5D9", // Soft Blush Pink  
            "#FFE5A5", // Light Buttercream Yellow  
            "#A2D2FF", // Muted Periwinkle  
            "#B6E2D3", // Pastel Turquoise  
            "#FEC3A6", // Warm Peach  
            "#C1C8E4", // Soft Lavender Blue  
            "#FFB4A2", // Sunset Coral  
            "#FFD6A5", // Soft Orange  
        ];
    
    // Pick a random color
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Apply the random background color to the task input
        input.style.backgroundColor = randomColor;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "x";
        deleteBtn.classList.add("delete-task");

        // Delete task event
        deleteBtn.addEventListener("click", () => {
            taskDiv.remove();
            saveTasks();
        });

        // Save tasks when text or checkbox changes
        input.addEventListener("input", saveTasks);
        checkbox.addEventListener("change", saveTasks);

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(input);
        taskDiv.appendChild(deleteBtn);
        taskContainer.appendChild(taskDiv);
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".task").forEach(taskDiv => {
            const taskText = taskDiv.querySelector(".task-input").value;
            const completed = taskDiv.querySelector(".task-checkbox").checked;
            tasks.push({ text: taskText, completed: completed });
        });

        ipcRenderer.send("save-todos", tasks);
    }

    // Add task event
    addTaskButton.addEventListener("click", () => {
        createTask();
        saveTasks();
    });

    // Clear all tasks event
    clearAllButton.addEventListener("click", () => {
        taskContainer.innerHTML = "";
        saveTasks();
    });

    function addTodoToIndex(todo) {
        createTask(todo.text, todo.completed);
    }

});
