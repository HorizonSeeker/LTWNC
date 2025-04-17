import express from "express";
import {
  authUser,
  registerUser,
  updateUserProfile,
  getUserProfile,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router
  .route("/profile")
  .post(protect, updateUserProfile)
  .get(protect, getUserProfile)
  .delete(protect, deleteUser);

export default router;
