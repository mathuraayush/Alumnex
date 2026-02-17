const express = require("express");
const router = express.Router();
const {
  createThread,
  getThreads,
  getThreadById,
  getCompanyStats,
  getDifficultyStats,
  getYearStats,
  bulkUploadThreads
} = require("../controllers/thread.controller");
const upload = require("../middleware/upload.middleware");



router.post("/", createThread);
router.get("/", getThreads);
router.get("/stats/company", getCompanyStats);
router.get("/stats/difficulty", getDifficultyStats);
router.get("/stats/year", getYearStats);
router.post("/bulk-upload", upload.single("file"), bulkUploadThreads);
router.get("/:id", getThreadById);

module.exports = router;
