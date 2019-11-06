const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
app.listen(8000, () => console.log("listening on port 8000"));
app.use(express.static(__dirname + "/public/dist/public"));
mongoose.set("useFindAndModify", false);
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/restfulTask", { useNewUrlParser: true });
const TaskSchema = new mongoose.Schema(
    {
        title: { type: String },
        description: { type: String, default: "" },
        completed: { type: Boolean, default: false }
    },
    { timestamps: true }
);
const Task = mongoose.model("Task", TaskSchema);

app.get("/tasks", (req, res) => {
    Task.find()
        .then(tasks => {
            res.json(tasks);
        })
        .catch(err => res.json(err));
});

app.get("/tasks/:id", (req, res) => {
    Task.findOne({ _id: req.params.id })
        .then(task => {
            res.json({
                message: "success",
                result: task
            });
        })
        .catch(err => res.json({ message: "error", result: err }));
});

app.post("/tasks", (req, res) => {
    const newTask = new Task(req.body);
    newTask
        .save()
        .then(newTask => {
            res.json({
                message: "success",
                result: newTask
            });
        })
        .catch(err => res.json({ message: "error", result: err }));
});

app.put("/tasks/:id", (req, res) => {
    const updatedTaskInfo = req.body;
    Task.findOneAndUpdate({ _id: req.params.id }, updatedTaskInfo)
        .then(updatedTask => {
            res.json({
                message: "success",
                result: updatedTask
            });
        })
        .catch(err => res.json({ message: "error", result: err }));
});

app.delete("/tasks/:id", (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id })
        .then(deletedTask => {
            res.json({
                message: "success",
                result: deletedTask
            });
        })
        .catch(err => res.json({ message: "error", result: err }));
});
