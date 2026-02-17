const express = require("express");
const router = express.Router();
const {
  createJobRole,
  getJobRolesByCompany,
} = require("../controllers/jobrole.controller");

// Create role
router.post("/", createJobRole);

// Get roles by company slug
router.get("/:slug", getJobRolesByCompany);

module.exports = router;
