require("./config/db");

const express = require("express");
const path = require("path");

const bodyparser = require("body-parser");

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const studentController = require("./controllers/studentController");
const registerController = require("./controllers/registerController");

var app = express();
app.use(
  bodyparser.urlencoded({
    extended: true
  })
);
app.use(bodyparser.json());
app.set("views", path.join(__dirname, "/views/"));
app.set("view engine", "pug");

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Passport Configuration
require('./config/auth')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.use("/student", studentController);
app.use("/", registerController)

app.get("/", function(req,res) {
  res.render("register");
})
app.listen(4000, () => {
  console.log("Express server started at port : 4000");
});
