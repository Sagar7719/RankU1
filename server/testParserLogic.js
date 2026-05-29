import fs from "fs";

function testParser() {
  const text = fs.readFileSync("last_pdf_text.txt", "utf-8");
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.match(/^--\s*\d+\s+of\s+\d+\s*--$/));

  const questionsMap = {};
  let currentQuestionNum = null;
  let inAnswerKey = false;
  let answerKeyText = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^Answer Key/i)) {
      inAnswerKey = true;
      continue;
    }

    if (inAnswerKey) {
      answerKeyText += " " + line;
      continue;
    }

    // Match question start: 'Q1.', '1.'
    const qMatch = line.match(/^(?:Q\s*)?(\d+)[\.\)]\s*(.+)/i);
    if (qMatch) {
      currentQuestionNum = parseInt(qMatch[1], 10);
      questionsMap[currentQuestionNum] = {
        questionText: qMatch[2],
        options: [],
        correctOptionIndex: null
      };
      continue;
    }

    if (currentQuestionNum && questionsMap[currentQuestionNum]) {
      // Match options: 'A.', 'A)'
      const optMatch = line.match(/^[a-d][\.\)]\s*(.+)/i);
      if (optMatch && questionsMap[currentQuestionNum].options.length < 4) {
        questionsMap[currentQuestionNum].options.push(optMatch[1]);
        continue;
      }

      // If no option matched, append to question or last option
      if (questionsMap[currentQuestionNum].options.length === 0) {
        questionsMap[currentQuestionNum].questionText += " " + line;
      } else {
        const lastIdx = questionsMap[currentQuestionNum].options.length - 1;
        questionsMap[currentQuestionNum].options[lastIdx] += " " + line;
      }
    }
  }

  // Parse Answer Key
  if (answerKeyText) {
    const regex = /\b(\d+)\.\s*([A-D])\b/gi;
    let match;
    while ((match = regex.exec(answerKeyText)) !== null) {
      const qNum = parseInt(match[1], 10);
      const ansChar = match[2].toUpperCase();
      if (questionsMap[qNum]) {
        questionsMap[qNum].correctOptionIndex = ansChar.charCodeAt(0) - 65;
      }
    }
  }

  const questions = Object.values(questionsMap).filter(q => q.options.length >= 2 && q.correctOptionIndex !== null);
  console.log("Parsed questions count:", questions.length);
  if (questions.length > 0) {
    console.log("First question:", questions[0]);
    console.log("Last question:", questions[questions.length - 1]);
  }
}

testParser();
