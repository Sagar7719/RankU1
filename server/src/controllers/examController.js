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
    const exam = new Exam(req.body);
    const savedExam = await exam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    next(error);
  }
};

export const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
