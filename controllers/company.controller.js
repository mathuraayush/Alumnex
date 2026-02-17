const Company = require("../models/Company.model");
const slugify = require("../utils/slugify");

// Create company (temporary manual usage via Postman)
exports.createCompany = async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = slugify(name);

    const existing = await Company.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const company = await Company.create({
      name,
      slug,
      description,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single company by slug
exports.getCompanyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
