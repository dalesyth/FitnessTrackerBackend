/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUser, getUserByUsername, createUser } = require("../db/users");

// usersRouter.use((req, res, next) => {
//   console.log("A request is being made to /users");

//   next();
// });

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (password.length < 8) {
      next({
        message: "Password Too Short!",
        name: "PasswordTooShortError",
        error: "Password Too Short",
      });
    }

    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        message: `User ${username} is already taken.`,
        name: "UserExistsError",
        error: `User ${username} is already taken`,
      });
    }

    const user = await createUser({ username, password });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET
    );

    res.send({
      message: "Thank you for signing up",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      message: "Please supply both a username and password",
      name: "MissingCredentialsError",
      error: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (user.username == username) {
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET);

      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        message: "Username or password is incorrect",
        name: "IncorrectCredentialsError",
        error: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;
