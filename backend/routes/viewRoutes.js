import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  renderLogin,
  renderRegister,
  renderNotes,
  renderProfile
} from "../controllers/viewController.js";

const router = express.Router();

// Public routes
router.get('/', renderLogin);
router.get('/login', renderLogin);
router.get('/register', renderRegister);

// Protected routes
router.get('/notes', protect, renderNotes);
router.get('/profile', protect, renderProfile);

export default router; 