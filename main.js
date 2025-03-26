const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

const todosFile = path.join(__dirname, "todos-list.json");

function loadTodos() {
    if (!fs.existsSync(todosFile)) {
        fs.writeFileSync(todosFile, "[]");
    }
    try {
        return JSON.parse(fs.readFileSync(todosFile, "utf8"));
    } catch (err) {
        console.error("ERROR LOADING", err);
        return [];
    }
}

function saveTodos(todos) {
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2));
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 264,
        height: 345,
        frame: false,
        icon: path.join(__dirname, 'static/icons/To-Do.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Enable Node.js in renderer process
            webSecurity: false
        }
    });

    console.log("Icon Path:", path.join(__dirname, 'static/icons/To-Do.png'));
    mainWindow.loadFile('index1.html');

    mainWindow.webContents.once("did-finish-load", () => {
        const loadedTodos = loadTodos();
        mainWindow.webContents.send("load-todos", loadedTodos);
    });

    ipcMain.on("request-todos", (event) => {
        const todos = loadTodos();
        event.reply("load-todos", todos);
    });

    ipcMain.on("save-todos", (event, todos) => {
        saveTodos(todos);
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
});
