// src/data/TestSeriesData.js
// SINGLE SOURCE OF TRUTH - Organized by ExamCategory first

// 1. First, define all test series organized by ExamCategory
export const TestsByCategory = {
    "महाराष्ट्र पोलीस भरती": {
        ExamCategory: "महाराष्ट्र पोलीस भरती",
        verified: true,
        series: [
            {
                SeriesTitle: "महाराष्ट्र पोलीस भरती परीक्षा",
                tests: [
                    {
                        TestTitle: "पोलीस भरती टेस्ट -02",
                        duration: "90 mins",
                        marks: "300 marks",
                        questionType: "MCQ",
                        TestCategory: ["Mock Tests", "Topicwise"], 
                        status: "free"
                    },
                    {
                        TestTitle: "पोलीस भरती टेस्ट -01",
                        duration: "120 mins",
                        marks: "200 marks",
                        questionType: "Mixed Questions",
                        TestCategory: ["Live Exams", "Mock Tests", "PYQs", "Topicwise"], 
                        status: "free"
                    },
                    {
                        TestTitle: "पोलीस भरती टेस्ट -03",
                        duration: "90 mins",
                        marks: "250 marks",
                        questionType: "Mixed Questions",
                        TestCategory: ["Live Exams", "Mock Tests", "Sectional"], // Renamed
                        status: "locked",
                        lockedMessage: "Login to Unlock"
                    },
                    {
                        TestTitle: "पोलीस भरती टेस्ट -04",
                        duration: "60 mins",
                        marks: "200 marks",
                        questionType: "Mixed Questions",
                        TestCategory: ["Mock Tests"], // Renamed
                        status: "scheduled",
                        scheduledDate: "Mar 04, 2026, 10:00 AM"
                    },
                    {
                        TestTitle: "पोलीस भरती टेस्ट -05",
                        duration: "60 mins",
                        marks: "200 marks",
                        questionType: "Mixed Questions",
                        TestCategory: ["Mock Tests"], // Renamed
                        status: "availableSoon"
                    }
                ]
            },
            {
                SeriesTitle: "Maharashtra Police Bharti Exam",
                tests: [
                    {
                        TestTitle: "Maharashtra Police Test - 01",
                        duration: "90 mins",
                        marks: "300 marks",
                        questionType: "MCQ",
                        TestCategory: ["Mock Tests"], // Renamed
                        status: "free"
                    },
                    {
                        TestTitle: "Maharashtra Police Test - 02",
                        duration: "120 mins",
                        marks: "200 marks",
                        questionType: "Mixed Questions",
                        TestCategory: ["Live Exams", "Mock Tests"], // Renamed
                        status: "free"
                    }
                ]
            }
        ]
    },
    "MPSC": {
        ExamCategory: "MPSC",
        verified: true,
        series: [
            {
                SeriesTitle: "MPSC COMBINE Grp-A",
                tests: [
                    {
                        TestTitle: "MPSC COMBINE Grp-A -01",
                        duration: "90 mins",
                        marks: "120 marks",
                        questionType: "MCQ",
                        TestCategory: ["PYQs","Sectional"], // Renamed
                        status: "free"
                    },
                    {
                        TestTitle: "MPSC COMBINE Grp-A -02",
                        duration: "60 mins",
                        marks: "90 marks",
                        questionType: "MCQ",
                        TestCategory: ["Live Exams", "Sectional"], // Renamed
                        status: "free"
                    }
                ]
            },
            {
                SeriesTitle: "MPSC COMBINE Grp-B",
                tests: []
            }
        ]
    },
    "Railways": {
        ExamCategory: "Railways",
        verified: true,
        series: [
            {
                SeriesTitle: "RRB NTPC-Graduate CBT-1",
                tests: []
            }
        ]
    },
    "SSC": {
        ExamCategory: "SSC",
        verified: true,
        series: [
            {
                SeriesTitle: "SSC GD 2026",
                tests: []
            }
        ]
    },
    "UPSC": {
        ExamCategory: "UPSC",
        verified: true,
        series: [
            {
                SeriesTitle: "UPSC CSE 2026",
                tests: []
            }
        ]
    },
    "BANKING": {
        ExamCategory: "BANKING",
        verified: true,
        series: [
            {
                SeriesTitle: "IBPS PO 2026",
                tests: []
            }
        ]
    }, "MH CET": {
        ExamCategory: "MH CET",
        verified: true,
        series: [
            {
                SeriesTitle: "MH CET 01",
                tests: []
            }
        ]
    },
    "Other categories": {
        ExamCategory: "Other categories",
        verified: true,
        series: [
            {
                SeriesTitle: "seriesA,B,C",
                tests: []
            }
        ]
    }
};

// Helper function to get all series as a flat array (for SearchResultsComponent)
export const getAllSeries = () => {
    return Object.values(TestsByCategory).flatMap(category =>
        category.series.map(series => ({
            ExamCategory: category.ExamCategory,
            SeriesTitle: series.SeriesTitle,
            verified: category.verified,
            testCount: series.tests.length,
            hasTests: series.tests.length > 0,
            // Pre-calculate free tests count
            freeTestsCount: series.tests.filter(t => t.status === 'free').length,
            // Pre-calculate total duration
            totalDuration: series.tests.reduce((total, test) => {
                const match = test.duration.match(/\d+/);
                return total + (match ? parseInt(match[0]) : 0);
            }, 0)
        }))
    );
};

// Helper function to get a specific series by title
export const getSeriesByTitle = (SeriesTitle) => {
    for (const category of Object.values(TestsByCategory)) {
        const series = category.series.find(s => s.SeriesTitle === SeriesTitle);
        if (series) {
            return {
                ...series,
                ExamCategory: category.ExamCategory,
                verified: category.verified
            };
        }
    }
    return null;
};

// Helper function to get all exam categories
export const getAllExamCategories = () => {
    return Object.keys(TestsByCategory);
};