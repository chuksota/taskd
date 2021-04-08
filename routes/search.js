const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("./utils");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const { List, Task } = db;

router.get(
  "/lists/:input",
  asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const input = req.params.input;
    console.log(input);
    const foundLists = await List.findAll({
      where: { userId, name: { [Op.iLike]: `%${input}%` } },
    });

    res.json({ foundLists });
  })
);

router.get(
  "/tasks/:input",
  asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const input = req.params.input;
    console.log(input);

    const foundListsWithTasks = await List.findAll({
      where: { userId },
      include: [
        { model: Task, where: { description: { [Op.iLike]: `%${input}%` } } },
      ],
    });

    const foundTasks = [];

    foundListsWithTasks.forEach((list) => {
      list.Tasks.forEach((task) => {
        foundTasks.push(task);
      });
    });

    res.json({ foundTasks });
  })
);

module.exports = router;
