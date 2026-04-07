const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
// const jwt = require("jsonwebtoken");
const isAdmin = require("../middleware/Admin");
const { isAuthenticated } = require("../middleware/Auth");

router.post("/answers", async (req, res) => {
  const { type, answers, commonAnswers } = req.body;

  try {
    const newAnswer = new Answer({ type, answers, commonAnswers });
    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

router.get("/answers", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const responses = await Answer.find()
            .populate("answers.questionId")
            .sort({ createdAt: -1 });

        res.status(200).json({ data: responses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;