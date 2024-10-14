const express = require("express");
const { urlencoded } = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios");

const { default: mongoose } = require("mongoose");
require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

//MIDDLEWARE
const auth = require("../middleWare/auth");

// SCHEMA
const { User, Task, UserTask } = require("../models/Schema");

// Add a task (admin only)
// Always add tiwtter to x and telegram to tg and discord, the full names
router.post("/", auth, async (req, res) => {
  const { role, username } = req.user;
  if (role === "admin") {
    const { description, points, link } = req.body;
    if (
      !description ||
      !points ||
      !link ||
      description === "" ||
      points === "" ||
      link === ""
    ) {
      return res.status(500).json({ err: "Please fill all input" });
    }
    const task = new Task({ description, points, link });
    await task.save();
    return res.json({ msg: "Task added successfully" });
  } else {
    res.status(500).json({ err: "UnAuthorized, Only Admin can Visit" });
  }
});

// Get tasks for a user excluding completed ones
router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.user;

    // Fetch all tasks and user's completed tasks
    const allTasks = await Task.find().sort({ createdAt: 1 });
    const userCompletedTasks = await UserTask.find({
      userId: id,
      completed: true,
    });

    const completedTaskIds = userCompletedTasks.map((userTask) =>
      userTask.taskId.toString()
    );

    // Add `claimed` field based on whether the task is completed
    const tasksForUser = allTasks.map((task) => ({
      ...task.toObject(), // Convert Mongoose document to plain JavaScript object
      claimed: completedTaskIds.includes(task._id.toString()),
    }));

    // Sort tasks: unclaimed first, then claimed
    tasksForUser.sort((a, b) => a.claimed - b.claimed);

    res.send(tasksForUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "SERVER ERROR" });
  }
});
// Check for membership
const checkMembers = async (chatId, userId) => {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getChatMember`, {
      params: {
        chat_id: chatId,
        user_id: userId,
      },
    });

    const { status } = response.data.result;

    if (
      status === "member" ||
      status === "administrator" ||
      status === "creator"
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Try Agian, Make sure you have joined");
    return false;
  }
};
// get chatId
const getChatId = async (communityUsername) => {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getChat`, {
      params: {
        chat_id: `@${communityUsername}`,
      },
    });

    const chatId = response.data.result.id;
    return chatId;
  } catch (error) {
    console.error("Error getting chat ID:", error);
  }
};

// Mark a task as completed by a user
router.put("/:taskId", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const { taskId } = req.params;
    const { userId } = req.body;
    // console.log(userId);
    // Find the task by taskId
    let task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ err: "No task was found" });

    //   6393211028
    if (task.description.includes("telegram")) {
      // console.log(task.link.includes("t.me"));
      const afterTMe = task.link.split("t.me/")[1];
      const chatId = await getChatId(afterTMe);
      const member = await checkMembers(chatId, userId);
      // console.log(member);
      if (member) {
        let userTask = await UserTask.findOne({ userId: id, taskId });
        if (userTask) {
          userTask.completed = true;
        } else {
          userTask = new UserTask({ userId: id, taskId, completed: true });
          await User.findByIdAndUpdate(req.user.id, {
            $inc: { point: task.points, taskPoints: task.points },
          });
        }
        await userTask.save();
        return res.json({ msg: "Claimed successfully" });
      } else {
        return res.json({ err: "Ouch You want to sneak in😂" });
      }
    } else {
      let userTask = await UserTask.findOne({ userId: id, taskId });
      if (userTask) {
        userTask.completed = true;
      } else {
        userTask = new UserTask({ userId: id, taskId, completed: true });
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { point: task.points, taskPoints: task.points },
        });
      }
      await userTask.save();
      res.json({ msg: "Claimed successfully" });
    }
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

// Remove a task (admin only)
router.delete("/:taskId", auth, async (req, res) => {
  const { role, username } = req.user;
  if (role === "admin") {
    const { taskId } = req.params;
    // console.log(taskId);
    await Task.findByIdAndDelete(taskId);
    await UserTask.deleteMany({ taskId: taskId });
    res.json({ message: "Task removed" });
  } else {
    res.status(500).json({ err: "UnAuthorized, Only Admin can Visit" });
  }
});

module.exports = router;
