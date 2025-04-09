const mongoose = require("mongoose");

// Define the question schema
const questionSchema = new mongoose.Schema(
  {
    questionNumber: { type: Number, required: true },
    question: { type: String, required: true },
    questionType: {
      type: String,
      required: true,
      enum: [
        "Single-Select",
        "Multi-Select",
        "Fill in the Blanks",
        "True/False",
        "Drag and Drop",
      ],
      default: "Single-Select",
    },
    options: [
      {
        label: { type: String, required: true },  
        text: { type: String, required: true },
      },
    ],
    terms: [String],
    definitions: [
      {
        text: { type: String },
        match: { type: String },
      },
    ],
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    explanation: {
      type: String,
      required: true,
      default: "No explanation provided",
    },
    tags: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Difficult"],
      default: "Medium",
    },
    marks: { type: Number, default: 1 },
    time: { type: Number, default: 30 },
  },
  { _id: true }
);

// Define the mock test schema
const mockTestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);


module.exports = mongoose.model("MockTest", mockTestSchema);
