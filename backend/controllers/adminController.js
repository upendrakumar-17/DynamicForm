const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Question = require("../models/Question");

exports.addQuestion = async (req, res) => {
  try {
    const { questionText, type } = req.body;

    const question = await Question.create({
      questionText,
      type,
    });

    res.status(201).json({
      success: true,
      question,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};