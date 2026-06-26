export const getTests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.exam) filter.exam = req.query.exam;
    if (req.query.seriesTitle) filter.seriesTitle = req.query.seriesTitle;
    if (req.query.examCategory) filter.examCategory = req.query.examCategory;
    if (req.query.teststatus) filter.teststatus = req.query.teststatus;
    if (req.query.questionType) filter.questionType = req.query.questionType;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;

    const tests = await Test.find(filter).sort({ createdAt: -1 }).lean();

    if (!tests.length) {
      return res.json([]);
    }

    const testIds = tests.map((test) => test._id);

    const questionCounts = await Question.aggregate([
      {
        $match: {
          testId: { $in: testIds },
        },
      },
      {
        $group: {
          _id: '$testId',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = questionCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    const testsWithQuestionCount = tests.map((test) => ({
      ...test,
      questionCount: countMap[test._id.toString()] || 0,
    }));

    res.json(testsWithQuestionCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};