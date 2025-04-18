const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Get all users (Admin only)
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
    try{
        const users = await User.find({role: 'user'}).select('-password');
        res.json(users);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

// @desc Get user by ID 
// @route GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

// @desc Delete user (Admin only)
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
    try{
        
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getUsers, getUserById, deleteUser };
