const User = require('../models/User');
const Category = require('../models/Category');
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).redirect("/login");
    } catch (error) {
        const errors = validationResult(req);
        for (let error of errors.array()) {
            req.flash("error", `${error.msg}`);
        }
        res.status(400).redirect("/register");
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    req.session.userID = user._id;
                    res.status(200).redirect("/users/dashboard");
                } else {
                    req.flash("error", "Your password is not correct");
                    res.status(400).redirect("/login");
                }
            });
        } else {
            req.flash("error", "No registered user found with this email");
            res.status(400).redirect("/login");
        }
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
        console.log(error);
    }
};

exports.logoutUser = async (req, res) => {
    await req.session.destroy();
    res.redirect("/");
};

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID }).populate("courses");
    const categories = await Category.find();
    const courses = await Course.find({
        user: req.session.userID,
    }).populate("category");
    res.status(200).render("dashboard", {
        user,
        pageName: "dashboard",
        categories,
        courses,
    });
};