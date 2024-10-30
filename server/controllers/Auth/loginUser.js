const { User, complexityOptions } = require('../../models/userModel');
const bcrypt = require('bcrypt');
const { profile } = require('console');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

exports.loginUser = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) 
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user) 
            return res.status(401).send({ message: 'Invalid Email or Password' });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) 
            return res.status(401).send({ message: 'Invalid Email or Password' });

        const token = user.generateAuthToken();
        
        res.status(200).send({
            message: 'Logged in successfully',
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userId: user._id,
                bio: user.bio,
                profilePicture: profile.Picture,
                active: true,
            },
        });
        console.log(user.bio)
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label('Email'),
        password: passwordComplexity(complexityOptions).required().label('Password'),
    });
    return schema.validate(data);
};
