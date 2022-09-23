const express = require("express");
const users = express.Router();
const todos = require("../models/todos");

users.get("/", (req, res) => {
    res.json(todos.listPeople());
});

users.get("/:name/tasks", (req, res) => {
    const { name } = req.params;
    const list = todos.list(name);
    res.status(200).json(list);
});


users.put("/:name/tasks/:num", (req, res) => {
    const { name, num } = req.params
    const complete = todos.complete(name, num)
    res.status(200).json(complete)
})

users.delete("/:name/tasks/:num", (req, res) => {
    const { name, num } = req.params
    const complete = todos.remove(name, num)
    res.status(204).json(complete)
})

module.exports = users;