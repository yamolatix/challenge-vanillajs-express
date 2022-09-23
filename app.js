'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", routes);

module.exports = app;

if (!module.parent) app.listen(3000);