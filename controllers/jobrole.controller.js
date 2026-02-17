const JobRole = require("../models/JobRole.model");
const Company = require("../models/Company.model");

// Create Job Role
exports.createJobRole = async (req, res) => {
  try {
    const { title, companySlug } = req.body;

    // Find company by slug
    const company = await Company.findOne({ slug: companySlug });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const jobRole = await JobRole.create({
      title,
      company: company._id,
    });

    res.status(201).json(jobRole);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Job role already exists for this company",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Get job roles by company slug
exports.getJobRolesByCompany = async (req, res) => {
  try {
    const { slug } = req.params;

    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const roles = await JobRole.find({ company: company._id }).sort({ title: 1 });

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
