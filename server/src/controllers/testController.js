import Test from "../models/testModel.js";
import Question from "../models/questionModel.js";
import Result from "../models/resultModel.js";

// GET ALL TESTS
export const getTests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.exam) filter.exam = req.query.exam;
    if (req.query.seriesTitle) filter.seriesTitle = req.query.seriesTitle;
    if (req.query.examCategory) filter.examCategory = req.query.examCategory;
    if (req.query.teststatus) filter.teststatus = req.query.teststatus;
    if (req.query.questionType) filter.questionType = req.query.questionType;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;

    const tests = await Test.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "testId",
          as: "questions"
        }
      },
      {
        $addFields: {
          questionCount: { $size: "$questions" }
        }
      },
      {
        $project: {
          questions: 0
        }
      }
    ]);

    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CREATE TEST
export const createTest = async (req, res) => {
  try {
    const {
      exam,
      testTitle,
      examCategory,
      seriesTitle,
      description,
      difficulty,
      questionsLimit,
      duration,
      marks,
      questionType,
      teststatus,
    } = req.body;

    const test = await Test.create({
      exam,
      testTitle,
      examCategory,
      seriesTitle,
      description,
      difficulty,
      questionsLimit: Number(questionsLimit) || 0,
      duration,
      marks,
      questionType,
      teststatus,
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
    const updateData = { ...req.body };

    if (updateData.questionsLimit !== undefined) {
      updateData.questionsLimit = Number(updateData.questionsLimit) || 0;
    }

    const test = await Test.findByIdAndUpdate(req.params.id, updateData, {
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
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // teststatus rules
    if (test.teststatus === "scheduled" || test.teststatus === "availablesoon") {
      return res.status(403).json({
        message: "This test is not available yet",
      });
    }

    if (test.teststatus === "locked") {
      const hasActivePlan = req.user?.plan?.isActive;
      if (!hasActivePlan) {
        return res.status(403).json({
          message: "This test is available for subscribed users only",
        });
      }
    }

    let questions = await Question.find({ testId: req.params.id })
      .select("-correctOptionIndex -explanation");

    if (test.questionsLimit && test.questionsLimit > 0 && questions.length > test.questionsLimit) {
      const attemptsCount = await Result.countDocuments({
        userId: req.user._id,
        testId: req.params.id,
      });

      const startIndex = (attemptsCount * test.questionsLimit) % questions.length;

      let slicedQuestions = questions.slice(startIndex, startIndex + test.questionsLimit);

      if (slicedQuestions.length < test.questionsLimit) {
        const remaining = test.questionsLimit - slicedQuestions.length;
        slicedQuestions = [...slicedQuestions, ...questions.slice(0, remaining)];
      }

      questions = slicedQuestions;
    }

    res.json({ test, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT TEST
// @route   POST /api/tests/:id/submit
export const submitTest = async (req, res) => {
  try {
    const { answers, duration, violations } = req.body;
    const testId = req.params.id;
    const userId = req.user._id;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (test.teststatus === "scheduled" || test.teststatus === "availablesoon") {
      return res.status(403).json({
        message: "This test is not available yet",
      });
    }

    if (test.teststatus === "locked") {
      const hasActivePlan = req.user?.plan?.isActive;
      if (!hasActivePlan) {
        return res.status(403).json({
          message: "This test is available for subscribed users only",
        });
      }
    }

    let questions = await Question.find({ testId });

    if (test.questionsLimit && test.questionsLimit > 0 && questions.length > test.questionsLimit) {
      const attemptsCount = await Result.countDocuments({
        userId,
        testId,
      });

      const startIndex = (attemptsCount * test.questionsLimit) % questions.length;

      let slicedQuestions = questions.slice(startIndex, startIndex + test.questionsLimit);

      if (slicedQuestions.length < test.questionsLimit) {
        const remaining = test.questionsLimit - slicedQuestions.length;
        slicedQuestions = [...slicedQuestions, ...questions.slice(0, remaining)];
      }

      questions = slicedQuestions;
    }

    let score = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    const processedAnswers = [];
    const subjectMap = {};

    questions.forEach((q) => {
      const qSubj = q.subject || "General Awareness";
      if (!subjectMap[qSubj]) {
        subjectMap[qSubj] = {
          subject: qSubj,
          totalQuestions: 0,
          correct: 0,
          wrong: 0,
          skipped: 0,
          score: 0,
        };
      }
      subjectMap[qSubj].totalQuestions += 1;

      totalMarks += q.marks;

      const userAnswer = answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );

      let isCorrect = false;
      let selectedOptionIndex = userAnswer ? userAnswer.selectedOptionIndex : null;

      if (selectedOptionIndex !== null && selectedOptionIndex !== undefined) {
        if (selectedOptionIndex === q.correctOptionIndex) {
          isCorrect = true;
          score += q.marks;
          correctCount++;
          subjectMap[qSubj].correct += 1;
          subjectMap[qSubj].score += q.marks;
        } else {
          isCorrect = false;
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
        isCorrect,
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
      subjectBreakdown,
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
        model: "Question",
      });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    if (result.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this result" });
    }

    const higherScores = await Result.countDocuments({
      testId: result.testId._id,
      score: { $gt: result.score },
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
      .populate("testId", "testTitle examCategory seriesTitle exam teststatus")
      .sort("-createdAt");

    const resultsWithRank = await Promise.all(
      results.map(async (r) => {
        const higherScores = await Result.countDocuments({
          testId: r.testId._id,
          score: { $gt: r.score },
        });
        return { ...r.toObject(), rank: higherScores + 1 };
      })
    );

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
    results.forEach((r) => {
      totalScore += r.score;
    });

    const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(2) : 0;

    res.json({
      totalTests,
      avgScore,
      recentResults: results.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};