"use strict";

var tasks = {};

module.exports = {
  reset: function () {
    tasks = {};
  },
  listPeople: function () {
    return Object.keys(tasks);
  },
  add: function (name, task) {
    if (!tasks[name]) tasks[name] = [];

    task.complete = task.complete || false;

    tasks[name].push(task);

    return task;
  },
  list: function (name) {
    return tasks[name];
  },
  complete: function (name, num) {
    if (tasks[name][num]) {
      tasks[name][num].complete = true
    };
  },
  remove: function (name, num) {
    tasks[name].splice(num, 1);
  },
};