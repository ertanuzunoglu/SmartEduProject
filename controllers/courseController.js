const Course = require('../models/Course');
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userID,
        });
        res.status(201).redirect("/courses");
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const categorySlug = req.query.category;
        const category = await Category.findOne({ slug: categorySlug });
        let filter = {};
        if (category) {
            filter = { category: category._id };
        }
        const categories = await Category.find();
        const courses = await Course.find(filter).sort("-createdAt");
        res.status(200).render("courses", {
            courses,
            categories,
            pageName: "courses",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug }).populate("user");
        res.status(200).render("course-single", {
            course,
            pageName: "courses",
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.push({ _id: req.body.course_id });
        await user.save();
        res.status(200).redirect("/users/dashboard");
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};

