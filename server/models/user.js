const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password:  {type: String, required: true},
    email:  {type: String, required: true, unique: true}
})

const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: '7d'})
    return token
}

const User = mongoose.model('user', userSchema)

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required().label('First name'),
        lastName: Joi.string().min(2).max(50).required().label('Last name'),
       email: Joi.string().required().label('Email'),
       password: passwordComplexity(complexityOptions).label('Password'),
    })

    return schema.validate(data)
}

module.exports = {User, validate, complexityOptions}
