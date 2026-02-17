const express = require("express");
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyBySlug,
} = require("../controllers/company.controller");

router.post("/", createCompany); // Temporary public
router.get("/", getCompanies);
router.get("/:slug", getCompanyBySlug);

module.exports = router;
