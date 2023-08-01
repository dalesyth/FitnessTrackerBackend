/* eslint-disable */
require("dotenv").config();
const express = require("express");
const app = express();

// Setup your Middleware and API Router here

// const {
//   USER: user,
//   HOST: host,
//   DATABASE: database,
//   PASSWORD: password,
//   PORT: port,
//   SERVER_PORT,
// } = process.env;

const morgan = require("morgan");

app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

app.use(express.json());

const apiRouter = require("./api");
app.use("/api", apiRouter);



module.exports = app;
