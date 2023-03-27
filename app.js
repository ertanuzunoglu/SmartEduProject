const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const methodOverride = require("method-override");

const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");

const app = express();

//db connect
mongoose.set("strictQuery", false);
mongoose
    .connect("mongodb://localhost/smartedu-db")
    .then(console.log("db connection successful"))
    .catch(err => console.log("db connection failed"));

//Template Engine
app.set("view engine", "ejs");

//global variable

global.userIN = null;

//Middlewares

app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "my_keyboard_cat",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost/smartedu-db",
        }), // server yeniden başlatıldığında logout olmaması için
    })
);
app.use(flash());
//kendi localimizde flashMessages diye bir dğişken ouşturup mesajları orada tutacağız.
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"],
    })
);

app.use("*", (req, res, next) => {
    userIN = req.session.userID;
    next();
});

//Routes
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

const port = 4000;
app.listen(port, () =>
    console.log(`App started on port ${port} http://localhost:4000/`)
);
