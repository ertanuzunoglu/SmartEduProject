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
        console.log("created");
        req.flash("success", `${course.name} has been created succesfully`);
        res.status(201).redirect("/courses");
    } catch (error) {
        req.flash("error", "Something happened");
        res.status(400).redirect("/courses");
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const categorySlug = req.query.category;
        const query = req.query.search;

        const category = await Category.findOne({
            slug: categorySlug,
        });
        let filter = {};

        if (category) {
            filter = { category: category._id };
        }

        if (query) {
            filter = { name: query };
        }

        if (!query && !categorySlug) {
            filter.name = "";
            filter.category = null;
        }

        const categories = await Category.find();
        const courses = await Course.find({
            $or: [
                { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
                { category: filter.category },
            ],
        })
            .sort("-createdAt")
            .populate("user");
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
        const user = await User.findById(req.session.userID);
        const course = await Course.findOne({ slug: req.params.slug }).populate("user");
        const categories = await Category.find();

        res.status(200).render("course-single", {
            course,
            pageName: "courses",
            user,
            categories,
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

exports.releaseCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.pull({ _id: req.body.course_id });
        await user.save();
        res.status(200).redirect("/users/dashboard");
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const courseDeleted = await Course.findOneAndRemove({
            slug: req.params.slug,
        });
        req.flash("success", `${courseDeleted.name} has been removed succesfully`);
        res.status(200).redirect("/users/dashboard");
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const courseUpdated = await Course.findOneAndUpdate(
            { slug: req.params.slug },
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
            }
        );
        console.log("updated");
        req.flash("success", `${courseUpdated.name} has been updated succesfully`);
        res.status(200).redirect("/users/dashboard");
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};



