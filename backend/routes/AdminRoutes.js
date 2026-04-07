const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/Auth");
const isAdmin  = require("../middleware/Admin");

const {
  loginUser,
} = require("../controllers/userController");

const {
    addQuestion,
    getUsers
} = require("../controllers/adminController");

router.post("/signin",loginUser);
router.post("/add-question", isAuthenticated, isAdmin, addQuestion);
router.get("/", isAuthenticated, isAdmin, getUsers);

module.exports = router;