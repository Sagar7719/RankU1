import Question from "../models/questionModel.js";

// @desc    Get all questions for a test
// @route   GET /api/questions/test/:testId
// @access  Private (Users & Admins)
export const getQuestionsByTestId = async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });

    // If user is not admin, exclude correctOptionIndex
    const processedQuestions = questions.map(q => {
      const qObj = q.toObject();
      if (req.user && req.user.role === 'admin') {
        return qObj;
      }
      // Hide correct answer for regular users
      delete qObj.correctOptionIndex;
      return qObj;
    });

    res.json(processedQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req, res) => {
  try {
    const {
      testId,
      questionText,
      options,
      correctOptionIndex,
      marks,
      negativeMarks,
      explanation,
      subject
    } = req.body;

    const question = await Question.create({
      testId,
      questionText,
      options,
      correctOptionIndex,
      marks,
      negativeMarks,
      explanation,
      subject
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    await question.deleteOne();
    res.json({ message: "Question removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
