const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;

    // ✅ Only fetch questionText
    const questions = await Question.find(filter).select("questionText");

    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Server error fetching questions" });
  }
});

module.exports = router;