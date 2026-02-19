const Thread = require("../models/Thread.model");
const Company = require("../models/Company.model");
const JobRole = require("../models/JobRole.model");
const slugify = require("../utils/slugify");
const csv = require("csv-parser");
const { Readable } = require("stream");
// Create Thread
exports.createThread = async (req, res) => {
  try {
    const {
      companySlug,
      roleTitle,
      yearOfPlacement,
      difficulty,
      rounds,
      topicsCovered,
      experience,
      candidateName,
      linkedin,
    } = req.body;

    // Auto-create or find Company
    let company = await Company.findOne({ slug: companySlug });
    
    if (!company) {
      // Reconstruct company name from slug
      const companyName = companySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      company = await Company.create({
        name: companyName,
        slug: companySlug,
      });
    }

    // Auto-create or find Job Role
    let jobRole = await JobRole.findOne({
      title: roleTitle,
      company: company._id,
    });

    if (!jobRole) {
      jobRole = await JobRole.create({
        title: roleTitle,
        company: company._id,
      });
    }

    const thread = await Thread.create({
      company: company._id,
      jobRole: jobRole._id,
      yearOfPlacement,
      difficulty,
      rounds,
      topicsCovered,
      experience,
      candidateName,
      linkedin,
    });

    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Threads with Filtering
exports.getThreads = async (req, res) => {
  try {
    const { company, role, year, difficulty, page = 1, limit = 10, search } = req.query;

    let filter = {};

    // Company filter
    if (company) {
      const companyDoc = await Company.findOne({ slug: company });
      if (companyDoc) {
        filter.company = companyDoc._id;
      }
    }

    // Role filter
    if (role) {
      const roleDoc = await JobRole.findOne({ title: role });
      if (roleDoc) {
        filter.jobRole = roleDoc._id;
      }
    }

    // Year filter
    if (year) {
      filter.yearOfPlacement = Number(year);
    }

    // Difficulty filter (case-insensitive match to support query values like 'easy' or 'EASY')
    if (difficulty) {
      filter.difficulty = { $regex: `^${difficulty}$`, $options: "i" };
    }


    // Global text search across all thread fields
    if (search) {
      filter.$or = [
        { experience: { $regex: search, $options: "i" } },
        { candidateName: { $regex: search, $options: "i" } },
        { linkedin: { $regex: search, $options: "i" } },
        { rounds: { $elemMatch: { $regex: search, $options: "i" } } },
        { topicsCovered: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }
    const skip = (page - 1) * limit;

    const threads = await Thread.find(filter)
      .populate("company", "name slug")
      .populate("jobRole", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Thread.countDocuments(filter);

    res.status(200).json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      results: threads,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getThreadById = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await Thread.findById(id)
      .populate("company", "name slug")
      .populate("jobRole", "title");

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Company Stats
exports.getCompanyStats = async (req, res) => {
  try {
    const stats = await Thread.aggregate([
      {
        $group: {
          _id: "$company",
          totalThreads: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      { $unwind: "$companyDetails" },
      {
        $project: {
          _id: 0,
          company: "$companyDetails.name",
          slug: "$companyDetails.slug",
          totalThreads: 1,
        },
      },
      {
        $sort: { totalThreads: -1 },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Difficulty Distribution

exports.getDifficultyStats = async (req, res) => {
  try {
    const stats = await Thread.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          difficulty: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get YearWise Stats
exports.getYearStats = async (req, res) => {
  try {
    const stats = await Thread.aggregate([
      {
        $group: {
          _id: "$yearOfPlacement",
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          total: 1,
        },
      },
      {
        $sort: { year: -1 },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Bulk Upload



exports.bulkUploadThreads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const rows = [];
    const errors = [];
    let inserted = 0;

    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        for (let row of rows) {
          try {
            // 🔹 Map friendly headers
            const companyName = row["Company Name"];
            const roleTitle = row["Role Offered"];
            const year = Number(row["Placement Year"]);
            const difficulty = row["Difficulty Level"];
            const rounds = row["Interview Rounds"]?.split("|") || [];
            const topics = row["Key Topics Covered"]?.split("|") || [];
            const experience = row["Interview Experience"];
            const candidateName = row["Your Name"] || "";
            const linkedin = row["LinkedIn Profile"] || "";

            if (!companyName || !roleTitle || !year || !difficulty || !experience) {
              errors.push({ row, error: "Missing required fields" });
              continue;
            }

            // 🔹 Auto-create Company
            const slug = slugify(companyName);

            let company = await Company.findOne({ slug });

            if (!company) {
              company = await Company.create({
                name: companyName,
                slug,
              });
            }

            // 🔹 Auto-create JobRole
            let jobRole = await JobRole.findOne({
              title: roleTitle,
              company: company._id,
            });

            if (!jobRole) {
              jobRole = await JobRole.create({
                title: roleTitle,
                company: company._id,
              });
            }

            // 🔹 Create Thread after checking Duplication
            const existingThread = await Thread.findOne({
              company: company._id,
              jobRole: jobRole._id,
              yearOfPlacement: year,
              candidateName: candidateName || "",
            });

            if (existingThread) {
              errors.push({
                row,
                error: "Duplicate thread detected",
              });
              continue;
            }

            await Thread.create({
              company: company._id,
              jobRole: jobRole._id,
              yearOfPlacement: year,
              difficulty,
              rounds,
              topicsCovered: topics,
              experience,
              candidateName,
              linkedin,
            });


            inserted++;
          } catch (err) {
            errors.push({ row, error: "Insertion failed" });
          }
        }

        res.status(200).json({
          totalRows: rows.length,
          inserted,
          failed: errors.length,
          errors,
        });
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

