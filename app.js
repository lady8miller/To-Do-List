const API_URL = "https://jsonplaceholder.typicode.com/todos";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const randomBtn = document.getElementById("randomBtn");

const tasksList = document.getElementById("tasksList");
const emptyState = document.getElementById("emptyState");
const counter = document.getElementById("counter");

const filterBtns = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* ================= storage ================= */

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ================= render ================= */

function render() {
  tasksList.innerHTML = "";

  let filtered = tasks.filter(t => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    const checkbox = document.createElement("div");
    checkbox.className = "checkbox" + (task.completed ? " checked" : "");
    checkbox.onclick = () => toggleTask(task.id);

    const title = document.createElement("div");
    title.className = "task-title" + (task.completed ? " completed" : "");
    title.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.onclick = () => deleteTask(task.id);

    li.append(checkbox, title, del);
    tasksList.appendChild(li);
  });

  emptyState.style.display = tasks.length === 0 ? "flex" : "none";
  counter.textContent = `${tasks.filter(t => t.completed).length} of ${tasks.length} tasks`;

  save();
}

/* ================= logic ================= */

function addTask(text) {
  if (!text.trim()) return;

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = "";
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  render();
}

/* ================= filters ================= */

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    render();
  });
});

/* ================= API (random) ================= */

async function addRandomTask() {
  const niceTasks = [
    "Go for a walk",
    "Feed the cat",
    "Read a book",
    "Do homework",
    "Drink water",
    "Call a friend",
    "Clean your room",
    "Practice coding",
    "Write in journal",
    "Study English"
  ];

  try {
    const randomId = Math.floor(Math.random() * 200) + 1;
    const res = await fetch(`${API_URL}/${randomId}`);

    if (!res.ok) {
      throw new Error("API error");
    }

    const data = await res.json();

    const randomTitle =
      niceTasks[Math.floor(Math.random() * niceTasks.length)];

    tasks.unshift({
      id: data.id,
      text: randomTitle,
      completed: false
    });

    render();
  } catch (error) {
    console.error("Failed to load random task", error);
  }
}

/* ================= events ================= */

addBtn.onclick = () => addTask(taskInput.value);
taskInput.onkeydown = (e) => {
  if (e.key === "Enter") addTask(taskInput.value);
};

randomBtn.onclick = addRandomTask;

/* ================= init ================= */

render();