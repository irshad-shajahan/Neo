var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var session = require("express-session");
const FileStore = require('session-file-store')(session);
const connectDB = require("./config/db");
var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
    helpers: {
      limit: function (arr, limit) {
        if (!Array.isArray(arr)) { return []; }
        return arr.slice(0, limit);
      },
      last: function (arr) {
        if (!Array.isArray(arr) || arr.length === 0) { return null; }
        return arr[arr.length - 1];
      }
    }
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new FileStore({ path: './sessions' }),
    secret: "key",
    cookie: { maxAge: 10000 * 60 * 60 },
    saveUninitialized: true,
    resave: false,
  })
);

// Middleware to initialize cart in session
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//mongodb connection
connectDB();

app.use("/", indexRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
