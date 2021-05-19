require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const logger = require('morgan');

/** requiring the Database */
const db = require('./models/index');
const { sendJson } = require('./middlewares/generate-response');
const err = require('./middlewares/error-middleware');

const app = express();
const log = console.log;
const port = process.env.PORT;

app.response.sendJson = sendJson;
app.use(express.json());
app.use(logger('dev'));
app.get("/", (req, res,next) => { throw new Error("Welcome to post comment demo") });

/** Routing will start from here.*/
app.use(require('./routes'));

/*** Error handling */
app.use(err.notFound);
app.use(err.converter);
app.use(err.handler);


db.sequelize.authenticate()
    .then(() => { 
        log(chalk.bgGreen.bold("\n\t Database connected..🚀 "));
        app.listen(port, () => log(chalk.bgGray.bold("\n\t Server is up and running at "), chalk.bgCyan.bold(" ",port, "🚀 ")));
    })
    .catch((err) => log(chalk.bgRedBright("\n\t ", err.message, " ")));
