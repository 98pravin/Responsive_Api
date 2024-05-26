const express = require("express");
const app = express();
const tasksRouter = require("./routes/tasks");

app.use(express.json());
app.use("/tasks", tasksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const router = express.Router();

let tasks = []; // In-memory storage for tasks
let currentId = 1;

// Helper function to find a task by ID
const findTaskById = (id) => tasks.find((task) => task.id === id);

//------------------------Api------------------------------

//1) `GET /tasks`: Retrieve a list of all tasks.
router.get("/", (req, res) => {
  res.json(tasks);
});

//2. `GET /tasks/:id`: Retrieve a specific task by ID.
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = findTaskById(id);

  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

//3. `POST /tasks`: Create a new task.
router.post("/", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  const newTask = {
    id: currentId++,
    title,
    description,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

//4. `PUT /tasks/:id`: Update an existing task by ID.
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;

  const task = findTaskById(id);

  if (task) {
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    task.title = title;
    task.description = description;

    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

//5. `DELETE /tasks/:id`: Delete a task by ID.
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

module.exports = router;
