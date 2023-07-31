// require express
const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

// require connect-flash
const flash = require("connect-flash");
const flashMiddleware = require("./config/flashMiddleware");

// used for session cookies
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport_local");

const MongoStore = require("connect-mongo");

// layouts for ejs
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: false }));

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./assets"));

//mongo store is used to store the session cookie
app.use(
  session({
    name: "habitTracker",
    secret: "12345",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl:
          "mongodb+srv://ansariarsu3264:VZqe10MOFxdJ5psw@cluster0.aewj7h4.mongodb.net/",
        autoRemover: "disabled",
      },
      function (err) {
        console.log("Error in the mongo-store");
      }
    ),
  })
);

// Using passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// flash middleware
app.use(flash());
app.use(flashMiddleware.setFlash);

// use express router
app.use("/", require("./routes"));

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// directing the app in the given port

connectDB().then(() => {
  app.listen(PORT, function (err) {
    if (err) {
      console.log("Error", err);
      return;
    }
    console.log(`server started on port  : ${PORT}`);
  });
});
