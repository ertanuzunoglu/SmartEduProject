const Category = require('../models/Category');
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).redirect("/users/dashboard");
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndRemove(req.params.id);
        const defaultCategory = await Category.findOne({
            slug: "unselected",
        });
        const updatedCourse = await Course.findOneAndUpdate(
            { category: req.params.id },
            { category: defaultCategory._id }
        );
        req.flash("success", `Category has been removed succesfully`);
        res.status(200).redirect("/users/dashboard");
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
};