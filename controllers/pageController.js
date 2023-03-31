const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");

exports.getIndexPage = async (req, res) => {
    const course = await Course.find().sort("-createdAt").limit(2);
    const totalCourses = await Course.find().countDocuments();
    const totalStudent = await User.find({ role: "student" }).countDocuments();
    const totalTeacher = await User.find({ role: "teacher" }).countDocuments();

    res.status(200).render("index", {
        pageName: "index",
        course,
        totalCourses,
        totalStudent,
        totalTeacher,
    });
};

exports.getAboutPage = (req, res) =>
    res.status(200).render("about", { pageName: "about" });

exports.getRegisterPage = (req, res) =>
    res.status(200).render("register", { pageName: "register" });

exports.getLoginPage = (req, res) =>
    res.status(200).render("login", { pageName: "login" });

exports.getContactPage = (req, res) =>
    res.status(200).render("contact", { pageName: "contact" });

exports.sendEmail = async (req, res) => {
    try {
        const outputMessage = `
        <h1>Message Details</h1>
        <ul>
            <li>Name:${req.body.name}</li>
            <li>E-mail:${req.body.email}</li>
            <li>Message:${req.body.message}</li>
        </ul>
        <h1>Message Details</h1>`;

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "ertanuzunogl@gmail.com",
                pass: "bkasogmvmmfrvmkn",
            },
        });

        await transporter.sendMail({
            from: '"Hello 👻" <ertanuzunogl@gmail.com>', // sender address
            to: "ertan.uzunoglu@kns.com.tr , aysenursanli99@gmail.com", // list of receivers
            subject: "Smart Edu Contact form", // Subject line
            html: `${outputMessage} <br> bu mail üzerinden otomatik gönderildi.`, // html body
        });

        req.flash("success", "we received your message succesfully");

        res.status(200).redirect("contact");
    } catch (err) {
        req.flash("error", `Something happened!`);
        res.status(200).redirect("contact");
    }
};
