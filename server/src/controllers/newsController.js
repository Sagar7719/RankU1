import News from "../models/newsModel.js";

// @desc    Get all news
// @route   GET /api/news
// @access  Public
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single news by ID
// @route   GET /api/news/:id
// @access  Public
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ message: "News not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create news (Admin only in future, currently public for ease)
// @route   POST /api/news
// @access  Public (for now)
export const createNews = async (req, res) => {
  try {
    const { title, category, image, description, fullContent } = req.body;
    const news = new News({
      title,
      category,
      image,
      description,
      fullContent
    });
    const createdNews = await news.save();
    res.status(201).json(createdNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
