require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const connection = require("./config/db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

connection();
// const connection = require("./config/db");

//middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// // 🔥 Connect to MongoDB Atlas
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ Connected to MongoDB Atlas"))
// .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/timesheet", require("./routes/timesheetRoutes"));
