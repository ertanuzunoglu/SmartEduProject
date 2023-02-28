const Course = require('../models/Course');
const Category = require('../models/Category');

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).redirect('/courses');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
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
        const courses = await Course.find(filter).sort('name');
        res.status(200).render('courses', {
            courses,
            categories,
            pageName: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug });
        res.status(200).render('course-single', {
            course,
            pageName: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};
