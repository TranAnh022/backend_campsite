const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const dotenv = require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

const User = require("./models/user.ts"); // requires the model with Passport-Local Mongoose plugged in

const userRouter = require("./routes/userRoutes");
const campsiteRouter = require("./routes/campSiteRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const cors = require("cors");

//-- connect to mongoose ---
const MongoDBStore = require("connect-mongo")(session);

//const dbUrl = process.env.DB_URL
const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/campsite";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

//--session--

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e:string) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false, // to prevent the Deprecation pop-up in command promt when using session
  saveUninitialized: true, // to prevent the Deprecation pop-up in command promt when using session
  cookie: {
    httpOnly: true,
    // secure: true,
    exprires: Date.now() + 1000 * 60 * 60 * 24 * 7, // set the time exprire for one week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("build"));
app.use(express.urlencoded({ extended: false })); // because the req.body was not parsered lead to we need to use express.urlencoded to parse the request body
app.use(methodOverride("_method"));

//--passport --- app.use session must be executed before passport session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

passport.serializeUser(User.serializeUser()); //store in the session
passport.deserializeUser(User.deserializeUser()); // unstore in the session

// ----Route ---
app.use("/", userRouter);
app.use("/campsites", campsiteRouter);
app.use("/campsites/:id/reviews", reviewRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
