import Test from "../models/testModel.js";

// GET ALL TESTS
export const getTests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const tests = await Test.find(filter);
    res.json(tests);
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

import Question from "../models/questionModel.js";
import Result from "../models/resultModel.js";

// GET TEST FOR USER (Sanitized)
// @route   GET /api/tests/:id/attempt
export const getTestForUser = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    // Fetch questions but exclude correctOptionIndex and explanation
    const questions = await Question.find({ testId: req.params.id })
      .select("-correctOptionIndex -explanation");

    res.json({ test, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT TEST
// @route   POST /api/tests/:id/submit
export const submitTest = async (req, res) => {
  try {
    const { answers, duration, violations } = req.body; // Array of { questionId, selectedOptionIndex }
    const testId = req.params.id;
    const userId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: "Test not found" });

    const questions = await Question.find({ testId });
    
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