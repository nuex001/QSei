const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please enter username"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    point: {
      type: Number,
      default: 0,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    taskPoints: {
      type: Number,
      default: 0,
    },
    invitesPoints: {
      type: Number,
      default: 0,
    },
    playPoints: {
      type: Number,
      default: 2,
    },
    refferals: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    quizes: [{ type: Date }],
    loginCounts: { type: Number, default: 1 },
    lastLogin: { type: Date, default: Date.now },
    streak: { type: Number, default: 0 },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

// Unique validation
userSchema.plugin(uniqueValidator, {
  message: "{PATH} has already been taken",
});

// Hashing password
userSchema.pre("save", async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});
//model
const User = mongoose.model("user", userSchema);

// Task schema and model
const taskSchema = new Schema(
  {
    description: String,
    points: Number,
    link: String,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

// User-Task schema and model
const userTaskSchema = new Schema({
  userId: String,
  taskId: mongoose.Schema.Types.ObjectId,
  completed: Boolean,
});

const UserTask = mongoose.model("UserTask", userTaskSchema);
//
const quizSchema = new Schema(
  {
    topic: {
      type: String,
      required: [true, "Please enter a description"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    question: {
      type: String,
      required: [true, "Please enter a question"],
    },
    A: {
      type: String,
      required: [true, "Please enter option A"],
    },
    B: {
      type: String,
      required: [true, "Please enter option B"],
    },
    C: {
      type: String,
      required: [true, "Please enter option C"],
    },
    D: {
      type: String,
      required: [true, "Please enter option D"],
    },
    answer: {
      type: String,
      required: [true, "Please enter the correct answer"],
      enum: ["A", "B", "C", "D"], // Specify the valid options for the answer
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("quiz", quizSchema);
//
module.exports = { User, Task, UserTask, Quiz };
