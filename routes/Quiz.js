const express = require("express");
const { urlencoded } = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");
require("dotenv").config();

//MIDDLEWARE
const auth = require("../middleWare/auth");

// SCHEMA
const { User, Quiz } = require("../models/Schema");

// GET QUIZ
router.post("/", auth, async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role === "admin") {
      //check if you have attempted already
      const quiz = new Quiz(req.body);
      await quiz.save();
      return res.json({ msg: "Class & Quiz added successfully" });
    } else {
      res.status(500).json({ err: "UnAuthorized, Only Admin can Visit" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json(error.message);
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const { quizId, answer } = req.body;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ err: "Invalid Id!" });
    }

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ err: "Quiz not found!" });
    }

    const user = await User.findById(id);
    const currentDate = new Date();
    if (user.playPoints >= 2) {
      // // Check if the user has already attempted a quiz today
      // const lastAttemptDate = new Date(user.quizes); // Assuming `user.quizes` stores the date of last attempt
      // const isSameDay =
      //   lastAttemptDate.getFullYear() === currentDate.getFullYear() &&
      //   lastAttemptDate.getMonth() === currentDate.getMonth() &&
      //   lastAttemptDate.getDate() === currentDate.getDate();

      // if (isSameDay) {
      //   return res.status(400).json({
      //     err: "You've already attempted a quiz today! Please try again tomorrow 🤭",
      //   });
      // }

      // Check if answer is correct
      if (quiz.answer.toLowerCase() === answer.toLowerCase()) {
        await User.findByIdAndUpdate(id, {
          $inc: { point: 1000, playPoints: -2 },
          $set: { quizes: currentDate }, // Store current date as last attempt
        });
        return res.json({ msg: "You got it right!" });
      } else {
        // Update the quizes field for the user to prevent further attempts today
        await User.findByIdAndUpdate(id, {
          quizes: currentDate,
          $inc: { point: 1000, playPoints: -2 },
        });
        return res.status(400).json({ err: "Oops, you failed😭" });
      }
    } else {
      return res.status(500).json({ err: "No Play Points😢" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: error.message });
  }
});

// GET QUIZ
router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    // Use skip to start at the quiz index that matches how many quizzes the user has already attempted
    const quiz = await Quiz.find()
      .sort({ createdAt: 1 }) // Sort by the latest quizzes
      .skip(user.quizes.length) // Skip the number of quizzes the user has already attempted
      .limit(1) // Only return one quiz
      .select("-answer"); // Exclude the answer field

    if (!quiz) {
      return res.status(404).json({ msg: "No new quiz available." });
    }

    res.json(quiz);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

module.exports = router;
/**2023-12-11T06:53:07.743+00:00  old time*/
