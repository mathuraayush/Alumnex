const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/company.routes");


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/companies", companyRoutes);
app.get("/", (req, res) => {
  res.send("Alumni Portal API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


