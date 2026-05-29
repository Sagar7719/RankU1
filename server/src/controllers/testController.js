import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";
import Result from "../models/resultModel.js";
import fs from "fs";
import { PDFParse } from "pdf-parse";

// GET ALL TESTS
export const getTests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const tests = await Test.find(filter).lean();
    
    // Attach question count
    const testsWithCounts = await Promise.all(
      tests.map(async (test) => {
        const questionCount = await Question.countDocuments({ testId: test._id });
        return { ...test, questionCount };
      })
    );
    
    res.json(testsWithCounts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE TEST
export const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      totalTests,
      duration,
      difficulty,
      testType,
      isFree,
    } = req.body;

    const test = await Test.create({
      title,
      description,
      category,
      totalTests,
      duration,
      difficulty,
      testType,
      isFree,
    });

    res.status(201).json(test);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET TEST BY ID
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TEST
export const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TEST
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    await test.deleteOne();
    res.json({ message: "Test removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET TEST FOR USER (Sanitized)
// @route   GET /api/tests/:id/attempt
export const getTestForUser = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Fetch questions but exclude correctOptionIndex and explanation
    let questions = await Question.find({ testId: req.params.id })
      .select("-correctOptionIndex -explanation");

    // Shuffle questions dynamically for each attempt (Fisher-Yates shuffle)
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    // Convert to plain objects and shuffle options for each question
    const processedQuestions = questions.map(q => {
      const qObj = q.toObject();
      const options = qObj.options || [];
      const optionOrder = options.map((_, idx) => idx);
      
      // Shuffle options and keep track of original indices
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
        [optionOrder[i], optionOrder[j]] = [optionOrder[j], optionOrder[i]];
      }
      qObj.options = options;
      qObj.optionOrder = optionOrder;
      return qObj;
    });

    // If test specifies a limited number of questions per attempt, slice the array
    let finalQuestions = processedQuestions;
    if (test.questionsPerAttempt && test.questionsPerAttempt > 0 && processedQuestions.length > test.questionsPerAttempt) {
      finalQuestions = processedQuestions.slice(0, test.questionsPerAttempt);
    }

    res.json({ test, questions: finalQuestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT TEST
// @route   POST /api/tests/:id/submit
export const submitTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const { answers, questionIds, duration, violations } = req.body;
    const userId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let query = { testId };
    // Only evaluate the subset of questions the user was assigned
    if (questionIds && Array.isArray(questionIds) && questionIds.length > 0) {
      query._id = { $in: questionIds };
    }
    const questions = await Question.find(query);
    
    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    const processedAnswers = [];
    const subjectMap = {}; // { [subjectName]: { totalQuestions, correct, wrong, skipped, score } }

    // Evaluate answers
    questions.forEach((q) => {
      const qSubj = q.subject || "General Awareness";
      if (!subjectMap[qSubj]) {
        subjectMap[qSubj] = { subject: qSubj, totalQuestions: 0, correct: 0, wrong: 0, skipped: 0, score: 0 };
      }
      subjectMap[qSubj].totalQuestions += 1;

      totalMarks += q.marks;
      
      const userAnswer = answers.find(a => a.questionId.toString() === q._id.toString());
      
      let isCorrect = false;
      let selectedOptionIndex = userAnswer ? userAnswer.selectedOptionIndex : null;

      if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
        if (selectedOptionIndex === q.correctOptionIndex) {
          isCorrect = true;
          score += q.marks; // Full marks for correct answer
          correctCount++;
          subjectMap[qSubj].correct += 1;
          subjectMap[qSubj].score += q.marks;
        } else {
          isCorrect = false;
          // Negative marking deduction
          score -= (q.negativeMarks || 0); 
          wrongCount++;
          subjectMap[qSubj].wrong += 1;
          subjectMap[qSubj].score -= (q.negativeMarks || 0);
        }
      } else {
        unattemptedCount++;
        subjectMap[qSubj].skipped += 1;
      }

      processedAnswers.push({
        questionId: q._id,
        selectedOptionIndex,
        isCorrect
      });
    });

    const subjectBreakdown = Object.values(subjectMap);

    const result = await Result.create({
      userId,
      testId,
      score,
      totalMarks,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unattempted: unattemptedCount,
      duration: duration || "0m 0s",
      answers: processedAnswers,
      violations: violations || 0,
      subjectBreakdown
    });

    res.status(201).json({ success: true, resultId: result._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET RESULT
// @route   GET /api/tests/results/:id
export const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("testId")
      .populate({
        path: "answers.questionId",
        model: "Question"
      });

    if (!result) return res.status(404).json({ message: "Result not found" });
    
    // Security check: only the user who took the test can see it
    if (result.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to view this result" });
    }

    // Calculate Rank for this specific test
    const higherScores = await Result.countDocuments({
      testId: result.testId._id,
      score: { $gt: result.score }
    });
    
    const rank = higherScores + 1;
    const totalAttempts = await Result.countDocuments({ testId: result.testId._id });

    res.json({ ...result.toObject(), rank, totalAttempts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL RESULTS FOR LOGGED IN USER
// @route   GET /api/tests/my-results
export const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate("testId", "title category")
      .sort("-createdAt");

    // Calculate rank for each result
    const resultsWithRank = await Promise.all(results.map(async (r) => {
      const higherScores = await Result.countDocuments({
        testId: r.testId._id,
        score: { $gt: r.score }
      });
      return { ...r.toObject(), rank: higherScores + 1 };
    }));

    res.json(resultsWithRank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET DASHBOARD STATS
// @route   GET /api/tests/dashboard-stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const results = await Result.find({ userId });
    
    const totalTests = results.length;
    
    let totalScore = 0;
    results.forEach(r => totalScore += r.score);
    const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(2) : 0;

    // Optional: Average rank or something? 
    // For now, just basic stats
    res.json({
      totalTests,
      avgScore,
      recentResults: results.slice(0, 5) // Last 5 results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPLOAD PDF QUESTIONS
// @route   POST /api/tests/:id/upload-pdf-questions
export const uploadPdfQuestions = async (req, res) => {
  try {
    const testId = req.params.id;
    const test = await Test.findById(testId);
    if (!test) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Test not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file provided" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    const text = data.text;
    
    // Debug: Save text to a file to inspect its format
    fs.writeFileSync("last_pdf_text.txt", text);

    // Clean up file
    fs.unlinkSync(req.file.path);

    // Parsing logic based on the format:
    // Q1. ... or 1. ...
    // A) ...
    // B) ...
    // C) ...
    // D) ...
    // Ans: ... or Answer: ...

    // Split text by lines, removing pagination and empty lines
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.match(/^--\s*\d+\s+of\s+\d+\s*--$/));

    const questionsMap = {};
    let currentQuestionNum = null;
    let inAnswerKey = false;
    let answerKeyText = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^Answer Key/i)) {
        inAnswerKey = true;
        continue;
      }

      if (inAnswerKey) {
        answerKeyText += " " + line;
        continue;
      }

      // Match question start: '1.', '1)', 'Q1.', 'Q1)'
      const qMatch = line.match(/^(?:Q\s*)?(\d+)[\.\)]\s*(.+)/i);
      if (qMatch) {
        currentQuestionNum = parseInt(qMatch[1], 10);
        questionsMap[currentQuestionNum] = {
          testId,
          subject: test.category || "General Awareness",
          questionText: qMatch[2],
          options: [],
          correctOptionIndex: null
        };
        continue;
      }

      if (currentQuestionNum && questionsMap[currentQuestionNum]) {
        // Match options: 'A.', 'A)', 'a.', 'a)'
        const optMatch = line.match(/^[a-d][\.\)]\s*(.+)/i);
        if (optMatch && questionsMap[currentQuestionNum].options.length < 4) {
          questionsMap[currentQuestionNum].options.push(optMatch[1]);
          continue;
        }

        // Match inline answer: 'Ans: A', 'Answer: a'
        const ansMatch = line.match(/^(?:Ans|Answer)[\s:]*([a-d])/i);
        if (ansMatch) {
          const ansChar = ansMatch[1].toUpperCase();
          questionsMap[currentQuestionNum].correctOptionIndex = ansChar.charCodeAt(0) - 65;
          continue;
        }

        // If no option or answer matched, append to question or last option
        if (questionsMap[currentQuestionNum].options.length === 0) {
          questionsMap[currentQuestionNum].questionText += " " + line;
        } else if (questionsMap[currentQuestionNum].correctOptionIndex === null) {
          const lastIdx = questionsMap[currentQuestionNum].options.length - 1;
          questionsMap[currentQuestionNum].options[lastIdx] += " " + line;
        }
      }
    }

    // Parse Answer Key if it exists
    if (answerKeyText) {
      const regex = /\b(\d+)\.\s*([A-D])\b/gi;
      let match;
      while ((match = regex.exec(answerKeyText)) !== null) {
        const qNum = parseInt(match[1], 10);
        const ansChar = match[2].toUpperCase();
        if (questionsMap[qNum]) {
          questionsMap[qNum].correctOptionIndex = ansChar.charCodeAt(0) - 65;
        }
      }
    }

    const questions = Object.values(questionsMap).filter(q => q.options.length >= 2 && q.correctOptionIndex !== null);

    if (questions.length === 0) {
      return res.status(400).json({ message: "No questions could be parsed from the PDF. Please check the format." });
    }

    await Question.insertMany(questions);

    res.status(201).json({ message: `Successfully added ${questions.length} questions`, count: questions.length });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};