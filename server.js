const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Alumni Portal API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const protect = require("./middlewares/auth.middleware");
const authorizeRoles = require("./middlewares/role.middleware");

app.get("/api/test", protect, authorizeRoles("tpo"), (req, res) => {
  res.json({ message: "TPO access granted" });
});
