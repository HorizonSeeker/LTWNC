import Note from "../models/noteModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get logged in user notes
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

//@description     Fetch single Note
//@route           GET /api/notes/:id
//@access          Public
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

//@description     Create single Note
//@route           POST /api/notes/create
//@access          Private
const CreateNote = asyncHandler(async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      res.status(400);
      throw new Error("Vui lòng điền đầy đủ tất cả các trường");
    }

    if (!req.user || !req.user._id) {
      res.status(401);
      throw new Error("Người dùng chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const note = new Note({ user: req.user._id, title, content, category });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    console.error("Lỗi khi tạo ghi chú:", error);
    res.status(500);
    throw new Error(`Lỗi khi tạo ghi chú: ${error.message}`);
  }
});

//@description     Delete single Note
//@route           DELETE /api/notes/:id
//@access          Private
const DeleteNote = asyncHandler(async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error("Note not Found");
    }

    // Kiểm tra quyền sở hữu note
    if (note.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("You can't perform this action");
    }

    // Sử dụng deleteOne thay vì remove
    await Note.deleteOne({ _id: req.params.id });
    
    res.json({ message: "Note Removed Successfully" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const UpdateNote = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error("Note not found");
    }

    if (note.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("You can't perform this action");
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const notesPage = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.render('notes', { notes });
});

const createNotePage = asyncHandler(async (req, res) => {
  res.render('create-note');
});

const editNotePage = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render('edit-note', { note });
});

const getNotePage = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render('note', { note });
});

export { 
  getNoteById, 
  getNotes, 
  CreateNote, 
  DeleteNote, 
  UpdateNote,
  notesPage,
  createNotePage,
  editNotePage,
  getNotePage
};
