const mongoose = require("mongoose");

const jobRoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate role under same company
jobRoleSchema.index({ title: 1, company: 1 }, { unique: true });

module.exports = mongoose.model("JobRole", jobRoleSchema);
