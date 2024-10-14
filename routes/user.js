const express = require("express");
const { urlencoded } = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const axios = require("axios");
const { ethers } = require("ethers");

//MIDDLEWARE
const auth = require("../middleWare/auth");

// SCHEMA
const { User } = require("../models/Schema");
const { log } = require("console");

const secretKey = process.env.SECRET_KEY;
// For Creating token
const createToken = (payload) => {
  return jwt.sign(payload, secretKey);
};

/**
 * @REFERALL On each refer, the user get's 100 points
 * @REFERALL_ID is the id of the returned user
 */
// Working for register users
router.post("/", async (req, res) => {
  // console.log(req.body);
  const { username, id, referId, address } = req.body;
  let token;
  try {
    let user = await User.findOne({ username });
    //   Checking if user is null
    // console.log(user);
    if (!user) {
      const user = new User({
        username: username,
        password: id,
      });
      await user.save();
      const payload = {
        user: {
          id: user.id,
          role: user.role,
          username: user.username,
        },
      };
      const token = createToken(payload);
      const userResponse = user.toObject();
      delete userResponse.password;
      res.json({
        jwt: token,
        role: user.role,
        myId: user.id,
        user: userResponse,
      });
      // console.log(referId);
      if (referId !== "") {
        await User.findByIdAndUpdate(referId, {
          $inc: { point: user.point * 0.1, invitesPoints: user.point * 0.1 },
          $push: { refferals: user._id },
        });
      }
    } else {
      // Matching the password
      const isMatch = await bcrypt.compare(id.toString(), user.password);
      if (!isMatch) {
        return res.status(401).json({ err: "Invalid Credentials" });
      }
      const payload = {
        user: {
          id: user.id,
          role: user.role,
          username: user.username,
        },
      };
      const token = createToken(payload);
      const userResponse = user.toObject();
      delete userResponse.password;
      res.json({
        jwt: token,
        role: user.role,
        myId: user.id,
        user: userResponse,
      });
    }
  } catch (error) {
    console.log(error.message);
    if (error.message.includes("username has already been taken")) {
      res.status(500).json({ err: "username has already been taken" });
    } else {
      res.status(500).json({ err: "Please fill all inputs" });
    }
  }
});

// GET USER INFO
router.put("/:username", async (req, res) => {
  try {
    const { username } = req.params;
// console.log(username);

    const user = await User.findOne({ username }).select(
      "-password -refferals"
    );
    if (user) {
      const currentDate = new Date();
      const lastLoginDate = new Date(user.lastLogin);

      // Check if the last login was today
      // Check for user verification and update points
      const isSameDay =
        currentDate.getFullYear() === lastLoginDate.getFullYear() &&
        currentDate.getMonth() === lastLoginDate.getMonth() &&
        currentDate.getDate() === lastLoginDate.getDate();
      if (!isSameDay) {
        // Update login count for today
        await User.findOneAndUpdate(
          { username },
          {
            $inc: { loginCounts: 1 },
          }
        );
      }
      // Calculate the difference in days between today and the last login date
      const today = new Date().setHours(0, 0, 0, 0);
      const lastLogin = new Date(user.lastLogin).setHours(0, 0, 0, 0);
      const diff = (today - lastLogin) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        await User.findOneAndUpdate(
          { username },
          {
            $inc: { streak: 1, point: 20, playPoints: 2 },
          }
        );
      } else {
        await User.findOneAndUpdate(
          { username },
          {
            $set: { streak: 1 }, // Use $set to update the streak value
            $inc: { point: 20, playPoints: 2 }, // Use $inc to increment playPoints
          }
        );
      }
      await User.findOneAndUpdate({ username }, { lastLogin: new Date() });
      // Respond with the current streak and whether the streak can be incremented
      res.json({
        lastLogin: user.lastLogin,
      });
    } else {
      // If no user found, return false
      res.json({ userExists: false });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// GET USER INFO
router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select("-password -refferals");
    res.json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// GET USER INFO
router.get("/top", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const users = await User.find()
      .select("-password -refferals") // Exclude password and referrals
      .sort({ point: -1 }) // Sort by points in descending order (highest to lowest)
      .limit(100); // Limit the results to the top 100
    const user = await User.findById(id).select("-password -refferals");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count how many users have more points than the current user
    const rank =
      (await User.countDocuments({ points: { $gt: user.points } })) + 1;
    // Construct the user details object with the rank
    const userDetails = {
      ...user.toObject(), // Convert Mongoose document to plain JavaScript object
      rank: rank,
    };
    const holdersCount = await User.countDocuments();
    // console.log(holdersCount);
    res.json({ users, userDetails, holdersCount });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

//Get all Referred
router.get("/referred", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ err: "No user was found" });
    // console.log(user);
    const users = [];
    for await (const ref of user.refferals) {
      const referred = await User.findById(ref).select("-password");
      users.push(referred);
    }
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

// GET USER INFO
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select(
      "-password -refferals"
    );
    if (user) {
      const currentDate = new Date();
      const lastLoginDate = new Date(user.lastLogin);

      // Check if the last login was today
      const isSameDay =
        currentDate.getFullYear() === lastLoginDate.getFullYear() &&
        currentDate.getMonth() === lastLoginDate.getMonth() &&
        currentDate.getDate() === lastLoginDate.getDate();

      // Calculate the difference in days between today and the last login date
      const today = new Date().setHours(0, 0, 0, 0);
      const lastLogin = new Date(user.lastLogin).setHours(0, 0, 0, 0);
      const diff = (today - lastLogin) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        user.streak += 1; // Reset streak
      } else if (diff > 1) {
        // If more than a day has passed, reset the streak
        user.streak = 1; // Reset streak
      }

      // Respond with the current streak and whether the streak can be incremented
      res.json({
        username: user.username,
        streak: user.streak,
        lastLogin: user.lastLogin,
        userExists: true,
        isSameDay: isSameDay,
      });
    } else {
      // If no user found, return false
      res.json({ userExists: false });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
