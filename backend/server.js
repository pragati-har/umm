
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// MIDDLEWARE
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err.message));

// MONGOOSE SCHEMA
const recordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: "General"
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// MODEL
const Record = mongoose.model("Record", recordSchema);

// GET ALL RECORDS
app.get("/api/records", async (req, res, next) => {
  try {
    const filter = req.query.category
      ? { category: req.query.category }
      : {};

    const records = await Record.find(filter).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
});

// GET SINGLE RECORD
app.get("/api/records/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
});

// CREATE RECORD
app.post("/api/records", async (req, res, next) => {
  try {
    const { name, email = "", category = "General", details = {} } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Valid name is required" });
    }

    const record = await Record.create({
      name: name.trim(),
      email,
      category,
      details
    });

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

// UPDATE RECORD
app.put("/api/records/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (req.body.name !== undefined) {
      if (typeof req.body.name !== "string" || !req.body.name.trim()) {
        return res.status(400).json({ message: "Valid name is required" });
      }
      record.name = req.body.name.trim();
    }

    if (req.body.email !== undefined) {
      record.email = req.body.email;
    }

    if (req.body.category !== undefined) {
      record.category = req.body.category;
    }

    if (req.body.details !== undefined) {
      record.details = {
        ...record.details,
        ...req.body.details
      };
    }

    await record.save();
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
});

// DELETE RECORD
app.delete("/api/records/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      message: "Record deleted successfully"
    });
  } catch (err) {
    next(err);
  }
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Server error" });
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
