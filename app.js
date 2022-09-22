'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();


module.exports = app;

if (!module.parent) app.listen(3000);