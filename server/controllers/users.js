const { userModel } = require('../models/user.js'); // Correct import
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { signToken } = require('../utils/index.js');

//create User
const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
        username: username,
        email: email,
        password: hashedPassword
    });

    const result = await newUser.save();
    result.password = ''; // Remove the password before sending the result
    res.send(result);
});
// Get User by ID
const getUserById = (async (req,res)=>{
    const user = await userModel.findById(req.params.id).exec()
    user.password = '';
    res.send(user)
})
// Get All User
const getAllUser = (async (req,res)=>{
    const users = await userModel.find({}).exec()
    res.send(users)
})
// Update User by ID
const updateById = (asyncHandler(async (req, res)=>{
    const id = req.params.id
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body,{
        new: true  
    })
    res.send(updatedUser)
}))
// Delete User
const deleteById = (async (req,res)=>{
    const id = req.params.id
    const user = await userModel.deleteOne({id})
    res.send(user)
})
// Login User and Sign Token
const loginUser = (asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({
        email: email
    })
    //Compare password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(401).json({ error: "Password or email incorrect!" })
    }
    //Return JWT to client
    const token = signToken(user._id, user.email, user.username)
    return res.status(200).json({ token })
}))
// Get Tweets by UserId
const getTweetByUserId = asyncHandler(async(req,res)=>{
    const id = req.params.id
    const users = await userModel.findById(id).populate('tweets').select('tweets')
    res.send(user)
})

module.exports = { createUser, getUserById, getAllUser, updateById, deleteById, loginUser, getTweetByUserId};
