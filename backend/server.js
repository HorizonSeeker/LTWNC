import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import path from "path";
import { fileURLToPath } from 'url';
import asyncHandler from "express-async-handler";

import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình dotenv - thêm đường dẫn cụ thể đến file .env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Log để debug
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

connectDB();

const app = express(); // main thing

app.use(express.json()); // to accept json data

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', viewRoutes);           // Đặt viewRoutes lên đầu
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

// --------------------------deployment------------------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
} else {
  app.get("/", (req, res) => {
    res.render('login');  // Render trang login thay vì gửi thông báo API
  });
}
// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}..`.yellow
      .bold
  )
);
