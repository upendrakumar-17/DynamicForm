const express = require("express");
const router = express.Router();
const Answer = require("../models/Answer");
// const jwt = require("jsonwebtoken");
const isAdmin = require("../middleware/Admin");
const { isAuthenticated } = require("../middleware/Auth");

router.post("/", async (req, res) => {
    try {
        const { type, answers } = req.body;

        if (!type || !answers) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newResponse = await Answer.create({
            type,
            answers,
        });

        res.status(201).json({
            message: "Form submitted successfully",
            data: newResponse,
        });
    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ message: error.message });
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