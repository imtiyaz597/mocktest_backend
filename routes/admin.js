 

const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const router = express.Router();

const MockTest = require("../models/MockTest");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const validQuestionTypes = [
  "Single-Select",
  "Multi-Select",
  "Fill in the Blanks",
  "True/False",
  "Drag and Drop",
];

function normalizeQuestionType(type) {
  const cleaned = (type || "").trim().toLowerCase();
  if (cleaned === "drag and drop") return "Drag and Drop";
  if (cleaned === "single-select") return "Single-Select";
  if (cleaned === "multi-select") return "Multi-Select";
  if (cleaned === "fill in the blanks") return "Fill in the Blanks";
  if (cleaned === "true/false" || cleaned === "true-false") return "True/False";
  return "Single-Select";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatQuestions(sheetData) {
  const answerLetters = ["A", "B", "C", "D", "E"];

  return sheetData.map((row, index) => {
    const rawType = row["Question Type"] || "Single-Select";
    const questionType = normalizeQuestionType(rawType);

    if (questionType === "Drag and Drop") {
      const terms = [row["Term1"], row["Term2"], row["Term3"], row["Term4"]]
        .filter((term) => term?.trim());

      let definitions = ["Definition1", "Definition2", "Definition3", "Definition4"]
        .map((key, idx) => {
          if (row[key]?.trim()) {
            return {
              text: row[key].trim(),
              match: row[`Match${idx + 1}`]?.trim() || "No Match",
            };
          }
          return null;
        })
        .filter(Boolean);

      definitions = shuffleArray(definitions);

      return {
        questionNumber: row["Question Number"] || index + 1,
        question: row["Question"]?.trim() || "Match the following",
        questionType,
        terms,
        definitions,
        answer: definitions.map((d) => d.match),
        explanation: row["Explanation"]?.trim() || "No explanation provided",
        tags: row["Tags"]
          ? row["Tags"].split(",").map((tag) => tag.trim())
          : [],
        difficulty: row["Difficulty"]?.trim() || "Medium",
        marks: Number(row["Marks"]) || 1,
        time: Number(row["Time (minutes)"]) || 30,
      };
    }

    // Single/Multiple-select, True/False, Fill in the blanks
    const options = answerLetters
      .map((letter) => {
        const optionText = row[`Option ${letter}`];
        return optionText ? { label: letter, text: optionText.trim() } : null;
      })
      .filter(Boolean);

    return {
      questionNumber: row["Question Number"] || index + 1,
      question: row["Question"] || "",
      questionType,
      options,
      answer: row["Correct Answer"] || "",
      explanation: row["Explanation"] || "No explanation provided",
      tags: row["Tags"] ? row["Tags"].split(",").map((tag) => tag.trim()) : [],
      difficulty: row["Difficulty"] || "Medium",
      marks: Number(row["Marks"]) || 1,
      time: Number(row["Time (minutes)"]) || 30,
    };
  });
}

router.post("/mock-tests", async (req, res) => {
  try {
    const { title, price, isFree, excelFile } = req.body;

    if (!title || !excelFile) {
      return res.status(400).json({ message: "Title and Excel file are required" });
    }

    const base64Data = excelFile.split(",")[1];
    const binaryData = Buffer.from(base64Data, "base64");

    const workbook = xlsx.read(binaryData, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    const questions = formatQuestions(rawData);

    const mockTest = new MockTest({
      title,
      price,
      isFree,
      questions,
    });

    await mockTest.save();

    res.status(201).json({ message: "Mock test created successfully", mockTest });
  } catch (error) {
    console.error("❌ Error creating mock test:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);
    const formattedQuestions = formatQuestions(rawData);

    res.json({ message: "File processed successfully", data: formattedQuestions });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/mock-tests", async (req, res) => {
  try {
    const mockTests = await MockTest.find();
    res.json(mockTests);
  } catch (err) {
    console.error("Error fetching mock tests:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/mock-tests/:testId", async (req, res) => {
  const { testId } = req.params;
  try {
    const mockTest = await MockTest.findById(testId);
    if (!mockTest) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    res.json(mockTest);
  } catch (error) {
    console.error("Error fetching mock test:", error);
    res.status(500).json({ message: "Server error" });
  }


  router.put("/mock-tests/:testId/questions/:questionNumber", async (req, res) => {
    try {
      const { testId, questionNumber } = req.params;
      const updatedData = req.body;
  
      const mockTest = await MockTest.findById(testId);
      if (!mockTest) {
        return res.status(404).json({ message: "Mock test not found" });
      }
  
      const questionIndex = mockTest.questions.findIndex(
        (q) => q.questionNumber === parseInt(questionNumber)
      );
  
      if (questionIndex === -1) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      mockTest.questions[questionIndex] = {
        ...mockTest.questions[questionIndex]._doc,
        ...updatedData,
      };
  
      await mockTest.save();
  
      res.json({ message: "Question updated", updatedQuestion: mockTest.questions[questionIndex] });
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
})

module.exports = router;