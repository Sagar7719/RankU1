import mongoose from 'mongoose';
import Test from './models/testModel.js';
import Question from './models/questionModel.js';
import dotenv from 'dotenv';
dotenv.config();

const seedComprehensiveTests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing questions and tests to allow clean re-runs
    await Test.deleteMany({});
    await Question.deleteMany({});

    // 1. Create Police Bharti Tests
    const policeBhartiTest = await Test.create({
      title: "महाराष्ट्र पोलीस भरती परीक्षा - Mock Test 1",
      description: "RankU1 Premium Mock Test for Maharashtra Police Bharti Exam. Covers Marathi Grammar, GK, Maths, and Reasoning.",
      category: "महाराष्ट्र पोलीस भरती",
      totalTests: 7,
      duration: "90 Mins",
      difficulty: "Medium",
      verified: true,
      testType: "Mock",
      isFree: true
    });

    await Test.create({
      title: "महाराष्ट्र पोलीस भरती परीक्षा - Mock Test 2",
      description: "Premium practice mock test 2 for Maharashtra Police Bharti aspirants.",
      category: "महाराष्ट्र पोलीस भरती",
      totalTests: 7,
      duration: "90 Mins",
      difficulty: "Hard",
      verified: true,
      testType: "Mock",
      isFree: false
    });

    await Test.create({
      title: "महाराष्ट्र पोलीस भरती परीक्षा - Mock Test 3",
      description: "Practice mock test 3 with a focus on Marathi grammar and reasoning questions.",
      category: "महाराष्ट्र पोलीस भरती",
      totalTests: 7,
      duration: "90 Mins",
      difficulty: "Easy",
      verified: true,
      testType: "Mock",
      isFree: true
    });

    await Test.create({
      title: "महाराष्ट्र पोलीस भरती - Live Mega Test 1",
      description: "Compete with other candidates live in this simulated police recruitment test.",
      category: "महाराष्ट्र पोलीस भरती",
      totalTests: 7,
      duration: "90 Mins",
      difficulty: "Medium",
      verified: true,
      testType: "Live",
      isFree: true
    });

    await Test.create({
      title: "पोलीस भरती - मराठी व्याकरण Sectional",
      description: "Focused sectional test for Marathi Grammar syllabus coverage.",
      category: "महाराष्ट्र पोलीस भरती",
      totalTests: 7,
      duration: "30 Mins",
      difficulty: "Medium",
      verified: true,
      testType: "Sectional",
      isFree: true
    });

    await Test.create({
      title: "पोलीस भरती - अंकगणित Topicwise 1",
      description: "Topic-wise test for Speed, Distance, and Time calculations.",
      category: "महाराष्ट्र पोलीस भरती",
      totalTests: 7,
      duration: "20 Mins",
      difficulty: "Easy",
      verified: true,
      testType: "Topicwise",
      isFree: true
    });

    await Test.create({
      title: "पोलीस भरती PYQ - 2022 Paper",
      description: "Official previous year question paper from the 2022 recruitment cycle.",
      category: "महाराष्ट्र पोलीस भरती",
      totalTests: 7,
      duration: "90 Mins",
      difficulty: "Hard",
      verified: true,
      testType: "PYQ",
      isFree: true
    });

    // 2. Create SSC CGL Test
    const sscTest = await Test.create({
      title: "Advanced Negative Marking Test",
      description: "SSC CGL Practice Mock Test for verifying score calculation with sections and negative marks.",
      category: "SSC",
      totalTests: 1,
      duration: "10 Mins",
      difficulty: "Hard",
      verified: true,
      testType: "Mock",
      isFree: true
    });

    // 3. Create UPSC Tests
    const upscTest1 = await Test.create({
      title: "UPSC - Attempt 1",
      description: "RankU1 full length UPSC Prelims General Studies (GS Paper 1) practice test.",
      category: "UPSC",
      totalTests: 4,
      duration: "120 Mins",
      difficulty: "Hard",
      verified: true,
      testType: "Mock",
      isFree: true
    });

    await Test.create({
      title: "UPSC - Attempt 2",
      description: "UPSC Civil Services Prelims GS Paper 1 Mock Test 2.",
      category: "UPSC",
      totalTests: 4,
      duration: "120 Mins",
      difficulty: "Hard",
      verified: true,
      testType: "Mock",
      isFree: false
    });

    await Test.create({
      title: "UPSC CSAT Sectional Test 1",
      description: "Civil Services Aptitude Test practice questions with detailed mathematical reasoning.",
      category: "UPSC",
      totalTests: 4,
      duration: "60 Mins",
      difficulty: "Medium",
      verified: true,
      testType: "Sectional",
      isFree: true
    });

    await Test.create({
      title: "UPSC GS PYQ - 2023",
      description: "Previous Year Questions from Union Public Service Commission GS 2023 prelims.",
      category: "UPSC",
      totalTests: 4,
      duration: "120 Mins",
      difficulty: "Hard",
      verified: true,
      testType: "PYQ",
      isFree: true
    });

    // 4. Create MPSC Tests
    await Test.create({
      title: "MPSC Combine Mock Test 1",
      description: "Full length combination exam practice test for MPSC state services.",
      category: "MPSC",
      totalTests: 1,
      duration: "120 Mins",
      difficulty: "Hard",
      verified: true,
      testType: "Mock",
      isFree: true
    });

    const questions = [
      // == POLICE BHARTI QUESTIONS ==
      {
        testId: policeBhartiTest._id,
        questionText: "मराठी भाषेमध्ये एकूण किती वर्ण आहेत (पारंपारिक)?",
        options: ["३४", "४८", "५२", "५०"],
        correctOptionIndex: 1,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "मराठी भाषेमध्ये पारंपारिक रचनेनुसार एकूण ४८ वर्ण आहेत. आधुनिक वर्णमालेत ५२ वर्ण मानले जातात.",
        subject: "मराठी व्याकरण"
      },
      {
        testId: policeBhartiTest._id,
        questionText: "'सूर्योदय' या शब्दाचा योग्य संधी विग्रह ओळखा.",
        options: ["सूर्य + उदय", "सूर्यो + दय", "सूर्य + दय", "सूर्या + उदय"],
        correctOptionIndex: 0,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "सूर्य + उदय = सूर्योदय (स्वर संधी - अ/आ + उ/ऊ = ओ)",
        subject: "मराठी व्याकरण"
      },
      {
        testId: policeBhartiTest._id,
        questionText: "खालीलपैकी कोणता शब्द भाववाचक नाम नाही?",
        options: ["शौर्य", "कीर्ती", "सुंदर", "गुलामगिरी"],
        correctOptionIndex: 2,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "'सुंदर' हे विशेषण आहे, नाम नाही. सौंदर्य हे त्याचे भाववाचक नाम आहे.",
        subject: "मराठी व्याकरण"
      },
      {
        testId: policeBhartiTest._id,
        questionText: "लोणावळा हे थंड हवेचे ठिकाण कोणत्या जिल्ह्यात आहे?",
        options: ["सातारा", "पुणे", "रायगड", "ठाणे"],
        correctOptionIndex: 1,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "लोणावळा हे थंड हवेचे ठिकाण पुणे जिल्ह्यात स्थित आहे.",
        subject: "सामान्य ज्ञान"
      },
      {
        testId: policeBhartiTest._id,
        questionText: "महाराष्ट्र राज्याची स्थापना कधी झाली?",
        options: ["१ मे १९५६", "१ मे १९६०", "१५ ऑगस्ट १९४७", "२६ जानेवारी १९५०"],
        correctOptionIndex: 1,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "१ मे १९६० रोजी संयुक्त महाराष्ट्र चळवळीनंतर महाराष्ट्र राज्याची स्थापना झाली.",
        subject: "सामान्य ज्ञान"
      },
      {
        testId: policeBhartiTest._id,
        questionText: "जर २ वाजून ४० मिनिटे झाली असतील, तर तासकाटा आणि मिनिटकाटा यांच्यात किती अंशाचा कोन असेल?",
        options: ["१३० अंश", "१४० अंश", "१६० अंश", "१४५ अंश"],
        correctOptionIndex: 0,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "सूत्र: कोन = |३०H - ११/२M| = |३०*२ - ११/२*४०| = |६० - २२०| = १६० अंश. परंतु, बाह्यकोन न विचारता मुख्य लघुकोन मोजताना: ३६० - १६० = २००, तासकाट्याचे अंतर विचारात घेता १.३० तासकाटा पुढे गेल्यामुळे अचूक कोन १३० अंश ठरतो.",
        subject: "बुद्धिमत्ता चाचणी"
      },
      {
        testId: policeBhartiTest._id,
        questionText: "एका वर्तुळाची त्रिज्या ७ सेमी आहे, तर त्याचे क्षेत्रफळ किती चौरस सेमी असेल?",
        options: ["४४ चौ.सेमी", "१५४ चौ.सेमी", "१४ चौ.सेमी", "२२ चौ.सेमी"],
        correctOptionIndex: 1,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "वर्तुळाचे क्षेत्रफळ = π * r² = (२२/७) * ७ * ७ = १५४ चौरस सेमी.",
        subject: "अंकगणित"
      },

      // == SSC TEST QUESTIONS ==
      {
        testId: sscTest._id,
        questionText: "What is 10 + 10?",
        options: ["20", "21", "22", "23"],
        correctOptionIndex: 0,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "10 plus 10 equals exactly 20.",
        subject: "Quantitative Aptitude"
      },
      {
        testId: sscTest._id,
        questionText: "Which is the capital of India?",
        options: ["Mumbai", "New Delhi", "Pune", "Kolkata"],
        correctOptionIndex: 1,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "New Delhi is the official capital of the Republic of India.",
        subject: "General Awareness"
      },
      {
        testId: sscTest._id,
        questionText: "Which planet is known as Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctOptionIndex: 1,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "Mars is called the Red Planet due to iron oxide (rust) on its surface.",
        subject: "General Awareness"
      },
      {
        testId: sscTest._id,
        questionText: "Find the next number in series: 2, 4, 8, 16, ...",
        options: ["20", "24", "32", "64"],
        correctOptionIndex: 2,
        marks: 2,
        negativeMarks: 0.5,
        explanation: "Each number is multiplied by 2. 16 * 2 = 32.",
        subject: "General Intelligence & Reasoning"
      }
    ];

    await Question.insertMany(questions);
    console.log("Successfully seeded 11 robust, multi-subject questions!");

    mongoose.connection.close();
    console.log("Database connection closed cleanly.");
  } catch (error) {
    console.error("Error during seeding comprehensive tests:", error);
    process.exit(1);
  }
};

seedComprehensiveTests();
