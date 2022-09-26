const express = require("express");
const users = express.Router();
const todos = require("../models/todos");

function userExists(req, res, next) {
    const list = todos.listPeople();
    const { name } = req.params;
    if (list.includes(name)) return next();
    res.sendStatus(404);
};

function correctKey(req, res, next) {
    const task = req.body;

    if (Object.keys(task).every(key => key === 'complete' || key === 'content')) return next();

    res.sendStatus(400);
};

users.get("/", (req, res) => {
    res.json(todos.listPeople());
});

users.get("/:name/tasks", userExists, (req, res) => {
    const { name } = req.params;
    const { status } = req.query
    let tasks = todos.list(name);

    if (status) {
        tasks = tasks.filter(task => status === "complete" ? task.complete : !task.complete);
    };
    res.status(200).json(tasks);
});

users.post("/:name/tasks", correctKey, (req, res) => {
    const { name } = req.params;
    const task = req.body;

    const add = todos.add(name, task);
    res.status(201).json(add);
});

users.put("/:name/tasks/:num", (req, res) => {
    const { name, num } = req.params;
    const complete = todos.complete(name, num);

    res.status(200).json(complete);
});

users.delete("/:name/tasks/:num", (req, res) => {
    const { name, num } = req.params;
    const remove = todos.remove(name, num);

    res.status(204).json(remove);
});

module.exports = users;