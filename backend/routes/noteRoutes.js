import express from "express";
import {
  getNoteById,
  getNotes,
  CreateNote,
  DeleteNote,
  UpdateNote,
  notesPage,
  createNotePage,
  editNotePage,
  getNotePage
} from "../controllers/noteController.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

// API routes
router.route("/").get(protect, getNotes);
router
  .route("/:id")
  .get(getNoteById)
  .delete(protect, DeleteNote)
  .put(protect, UpdateNote);
router.route("/create").post(protect, CreateNote);

// View routes
router.get("/view", protect, notesPage);
router.get("/create/view", protect, createNotePage);
router.get("/edit/:id", protect, editNotePage);
router.get("/view/:id", protect, getNotePage);

export default router;
