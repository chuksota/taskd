const express = require("express");
const router = express.Router();
const db = require("../db/models");
const { asyncHandler, csrfProtection } = require("./utils");
const { check, validationResult } = require("express-validator");
const { Task } = db;

router.get(
  "/:listId(\\d+)",
  asyncHandler(async (req, res) => {
    const listId = parseInt(req.params.listId);
    const tasks = await db.Task.findAll({ where: { listId } });

    res.json({ tasks });
  })
);

const taskValidators = [
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Please enter a description")
    .isLength({ max: 200 })
    .withMessage("descirption cannot be more than 200 characters"),
  check("notes")
    .isLength({ max: 500 })
    .withMessage("notes cannot be more than 500 characters"),
];

router.post(
  "/",
  taskValidators,
  asyncHandler(async (req, res) => {
    const { description, notes, dueDate, listId } = req.body;
    const { userId } = req.session.auth;
    const newTask = await Task.build({ description, notes, dueDate, listId });

    const validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) {
      if (userId !== 1) {
        await newTask.save();
      }
      res.json({ newTask });
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.json({ errors });
    }
  })
);

router.put(
  "/:id(\\d+)",
  taskValidators,
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await Task.findByPk(id);
    const { userId } = req.session.auth;
    const { description, notes, dueDate, completed } = req.body;

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.json({ errors });
      return;
    }

    if (task) {
      task.description = description;
      task.notes = notes;
      task.dueDate = dueDate;
      task.completed = completed;
      if (userId !== 1) {
        await task.save();
      }
      res.json({ task });
    } else {
      const error = new Error(`Task ${id} not found!`);
      error.status = 404;
      error.title = "Task not found";
      res.json({ error });
    }
  })
);

router.delete(
  "/:id(\\d+)",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { userId } = req.session.auth;
    const task = await Task.findByPk(id);
    if (userId !== 1) {
      await task.destroy();
    }
    res.status(204).end();
  })
);

module.exports = router;
