import asyncHandler from "express-async-handler";
import Note from "../models/noteModel.js";
import User from "../models/userModel.js";

// Các hàm render
export const renderLogin = (req, res) => {
    res.render('login');
};

export const renderRegister = (req, res) => {
    res.render('register');
};

export const renderNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({ user: req.user._id });
    res.render('notes', { 
        notes,
        user: req.user 
    });
});

export const renderProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('profile', { user });
}); 