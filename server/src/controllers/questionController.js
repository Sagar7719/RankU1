import Question from "../models/questionModel.js";
import pdfParse from "pdf-parse-new";

// @desc    Get all questions for a test
// @route   GET /api/questions/test/:testId
// @access  Private (Users & Admins)
export const getQuestionsByTestId = async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId });

    const processedQuestions = questions.map((q) => {
      const qObj = q.toObject();
      if (req.user && req.user.role === "admin") {
        return qObj;
      }
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
      runValidators: true
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

// @desc    Import questions from a PDF file
// @route   POST /api/questions/import-pdf/:testId
// @access  Private/Admin
export const importQuestionsFromPdf = async (req, res) => {
  try {
    const { testId } = req.params;
    const subject = req.body.subject || "General Awareness";
    const marks = Number(req.body.marks) || 1;
    const negativeMarks = Number(req.body.negativeMarks) || 0.25;

    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    const parsedQuestions = [];
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    let i = 0;
    while (i < lines.length) {
      const qMatch = lines[i].match(/^(?:Q\.?\s*)?([0-9]+)[.)\s]\s*(.+)/);
      if (!qMatch) {
        i++;
        continue;
      }

      let questionText = qMatch[2].trim();
      const options = [];
      let correctOptionIndex = 0;
      let explanation = "";

      i++;

      // Collect multi-line question text (lines that don't match option/answer patterns)
      while (i < lines.length) {
        const line = lines[i];
        
        // Check if this line is an option (A), B), etc.)
        const isOption = /^(?:^|[\s(])([A-Da-d])([.)])\s*/i.test(line);
        
        // Check if this line is an answer
        const isAnswer = /^(?:Ans(?:wer)?|Correct(?:\s+Answer)?)[:\s]+([A-Da-d1-4])/i.test(line);
        
        // Check if this line is an explanation
        const isExplanation = /^(?:Explanation|Reason|Solution)[:\s]+/i.test(line);
        
        // Check if this line is a new question
        const isNewQuestion = /^(?:Q\.?\s*)?([0-9]+)[.)\s]\s*.+/i.test(line);
        
        // If it's not an option, answer, explanation, or new question, it's part of the question text
        if (!isOption && !isAnswer && !isExplanation && !isNewQuestion && line.length > 0) {
          questionText += " " + line;
          i++;
        } else {
          break;
        }
      }

      while (i < lines.length) {
        const matches = [...lines[i].matchAll(/(?:^|[\s(])([A-Da-d])([.)])\s*(.*?)(?=\s*(?:(?:^|[\s(])[A-Da-d][.)]|$))/gi)];
        if (matches.length > 0) {
          matches.forEach((m) => {
            options.push(m[3].trim());
          });
          i++;
        } else {
          break;
        }
      }

      if (i < lines.length) {
        const ansMatch = lines[i].match(/^(?:Ans(?:wer)?|Correct(?:\s+Answer)?)[:\s]+([A-Da-d1-4])/i);
        if (ansMatch) {
          const ansVal = ansMatch[1].toUpperCase();
          if (["A", "B", "C", "D"].includes(ansVal)) {
            correctOptionIndex = ["A", "B", "C", "D"].indexOf(ansVal);
          } else {
            correctOptionIndex = Math.min(Number(ansVal) - 1, 3);
          }
          i++;
        }
      }

      if (i < lines.length) {
        const expMatch = lines[i].match(/^(?:Explanation|Reason|Solution)[:\s]+(.+)/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
          i++;
          
          // Collect multi-line explanation
          while (i < lines.length) {
            const line = lines[i];
            const isNewQuestion = /^(?:Q\.?\s*)?([0-9]+)[.)\s]\s*.+/i.test(line);
            const isOption = /^(?:^|[\s(])([A-Da-d])([.)])\s*/i.test(line);
            const isAnswer = /^(?:Ans(?:wer)?|Correct(?:\s+Answer)?)[:\s]+([A-Da-d1-4])/i.test(line);
            
            // Stop if we hit a new question, option, or answer
            if (isNewQuestion || isOption || isAnswer) {
              break;
            }
            
            // Add line to explanation if it's not empty
            if (line.length > 0) {
              explanation += " " + line;
              i++;
            } else {
              // Empty line might mark end of explanation
              // Check if next line is a new question
              if (i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                const isNextNewQuestion = /^(?:Q\.?\s*)?([0-9]+)[.)\s]\s*.+/i.test(nextLine);
                if (isNextNewQuestion) {
                  break;
                }
              }
              i++;
            }
          }
        }
      }

      if (questionText && options.length >= 2) {
        parsedQuestions.push({
          testId,
          questionText,
          options: options.slice(0, 4),
          correctOptionIndex,
          marks,
          negativeMarks,
          subject,
          explanation
        });
      }
    }

    if (parsedQuestions.length === 0) {
      return res.status(422).json({
        message:
          "No valid questions found in the PDF. Please ensure questions follow the supported format: Q1. Question\nA) Option1\nB) Option2\nAns: A"
      });
    }

    const inserted = await Question.insertMany(parsedQuestions);
    res.status(201).json({
      message: `Successfully imported ${inserted.length} questions`,
      count: inserted.length,
      questions: inserted
    });
  } catch (error) {
    console.error("PDF import error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update all questions in a test
// @route   PUT /api/questions/test/:testId/bulk
// @access  Private/Admin
export const bulkUpdateQuestions = async (req, res) => {
  try {
    const { testId } = req.params;
    const { subject, marks, negativeMarks } = req.body;

    const updateData = {};
    if (subject) updateData.subject = subject;
    if (marks !== undefined) updateData.marks = Number(marks);
    if (negativeMarks !== undefined) updateData.negativeMarks = Number(negativeMarks);

    const result = await Question.updateMany({ testId }, updateData);
    res.json({
      message: `Successfully updated all ${result.modifiedCount} questions in this test.`,
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};