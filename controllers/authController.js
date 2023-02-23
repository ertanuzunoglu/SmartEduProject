const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            user: user,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
        console.log(error);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // const user = await User.findOne({ email });
        // if (user) {
        //     bcrypt.compare(password, user.password, (err, same) => {
        //         console.log('3', err);
        //         if (same) {
        //             res.status(200).send('you are logged in');
        //         }
        //     });
        // }
        await User.findOne({ email: email }, (err, user) => {
            if (user) {
                console.log(user.password);
                console.log(email, password);
                console.log('2', err);
                bcrypt.compare(password, user.password, (err, same) => {
                    console.log('3', err);
                    //iki şifre birbirinin aynısıysa same true olarak döner.
                    console.log(same);

                    if (same) {
                        res.status(200).send('you are logged in');
                    }
                });
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
        console.log(error);
    }
};