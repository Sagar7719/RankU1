import Exam from "../models/examModel.js";

export const getExams = async (req, res, next) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    next(error);
  }
};

export const createExam = async (req, res, next) => {
  try {
    const examData = { ...req.body };
    
    // Check if files were uploaded
    if (req.files) {
      if (req.files.syllabusPdf && req.files.syllabusPdf[0]) {
        examData.syllabusLink = `/uploads/${req.files.syllabusPdf[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        examData.image = `/uploads/${req.files.image[0].filename}`;
      }
    }

    const exam = new Exam(examData);
    const savedExam = await exam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const examData = { ...req.body };
    
    // Check if files were uploaded
    if (req.files) {
      if (req.files.syllabusPdf && req.files.syllabusPdf[0]) {
        examData.syllabusLink = `/uploads/${req.files.syllabusPdf[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        examData.image = `/uploads/${req.files.image[0].filename}`;
      }
    }

    const exam = await Exam.findByIdAndUpdate(req.params.id, examData, { new: true });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    next(error);
  }
};

export const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted" });
  } catch (error) {
    next(error);
  }
};
