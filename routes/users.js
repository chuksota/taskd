const express = require("express");
const router = express.Router();
const db = require("../db/models");
const bcrypt = require("bcryptjs");
const { asyncHandler, csrfProtection } = require("./utils");
const { check, validationResult } = require("express-validator");
const { loginUser, logoutUser } = require("../auth");
const list = require("../db/models/list");

/* GET users listing. */
router.get("/signup", csrfProtection, function (req, res, next) {
  const user = db.User.build();
  res.render("signup", { title: "Sign Up", csrfToken: req.csrfToken(), user });
});

const signUpValidators = [
  check("userName")
    .exists({ checkFalsy: true })
    .withMessage("Please enter a username")
    .isLength({ max: 100 })
    .withMessage("Username must not be more than 100 characters long")
    .custom((value) => {
      return db.User.findOne({ where: { userName: value } }).then((user) => {
        if (user) {
          return Promise.reject("The provided username is already in use");
        }
      });
    }),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please enter an email")
    .isLength({ max: 100 })
    .withMessage("Email must not be more than 100 characters long")
    .isEmail()
    .withMessage("Email is not valid")
    .custom((value) => {
      return db.User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject("The provided email is already in use");
        }
      });
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for password")
    .isLength({ min: 5 })
    .withMessage("Password must be longer than 5 characters"),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for confirm password")
    .isLength({ min: 5 })
    .withMessage("Confirm password must be longer than 5 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password does not match Password");
      }
      return true;
    }),
];

router.post(
  "/signup",
  csrfProtection,
  signUpValidators,
  asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;
    const user = db.User.build({
      userName,
      email,
    });
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      const newList = db.List.build({
        name: "Get Started",
        userId: user.id,
      });
      await newList.save();
      const newTask = db.Task.build({
        description: "Click Create New Task",
        notes: "This will add a task to the current list.",
        listId: newList.id,
      });
      await newTask.save();
      const newTask2 = db.Task.build({
        description: "Click Create New List",
        notes: "This will add a new list.",
        listId: newList.id,
      });
      await newTask2.save();
      loginUser(req, res, user);
      res.redirect("/homepage");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("signup", {
        title: "Sign Up",
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get("/login", csrfProtection, (req, res) => {
  res.render("login", { title: "Login", csrfToken: req.csrfToken() });
});

const loginValidators = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide an email"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password"),
];

router.post(
  "/login",
  loginValidators,
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const validatorErrors = validationResult(req);
    let errors = [];
    if (validatorErrors.isEmpty()) {
      const user = await db.User.findOne({ where: { email } });
      if (user) {
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString()
        );
        if (passwordMatch) {
          loginUser(req, res, user);
          return req.session.save((err) => {
            if (err) {
              next(err);
            } else {
              return res.redirect("/homepage");
            }
          });
        }
      }
      errors.push("Login failed for the provided email and password");
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }
    res.render("login", { title: "Login", errors, csrfToken: req.csrfToken() });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res, next) => {
    logoutUser(req, res);
    return req.session.save((err) => {
      if (err) {
        next(err);
      } else {
        return res.redirect("/");
      }
    });
  })
);

module.exports = router;
