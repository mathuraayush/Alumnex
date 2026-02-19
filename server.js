const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/company.routes");
const jobRoleRoutes = require("./routes/jobrole.routes");
const threadRoutes = require("./routes/thread.routes");
const adminRoutes = require("./routes/admin.routes");







connectDB();

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim().replace(/\/+$/g, ""))
  : [];

app.use(
  cors()
  );






app.use(express.json());
app.use("/api/companies", companyRoutes);
app.use("/api/jobroles", jobRoleRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("Alumni Portal API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


