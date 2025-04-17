import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Note from "../models/noteModel.js";
import generateToken from "../utils/generateToken.js";

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Register new user
//@route           POST /api/users/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   POST /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

// @desc    Delete user and their notes
// @route   DELETE /api/users/profile
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  try {
    // First, delete all notes belonging to the user
    await Note.deleteMany({ user: req.user._id });

    // Then delete the user
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({
      message: "User and all associated notes deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500);
    throw new Error("Error deleting user and notes");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const loginPage = asyncHandler(async (req, res) => {
  res.render('login');
});

const registerPage = asyncHandler(async (req, res) => {
  res.render('register');
});

const profilePage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render('profile', { user });
});

export { 
  authUser, 
  updateUserProfile, 
  registerUser, 
  deleteUser, 
  getUserProfile,
  loginPage,
  registerPage,
  profilePage
};
