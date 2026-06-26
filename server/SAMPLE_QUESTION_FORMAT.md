# PDF Question Import Format Guide

## Supported Format Features

Your PDF questions can now have:
- ✅ Multi-line questions
- ✅ Multi-line options
- ✅ Multi-line explanations (Explanation, Reason, or Solution)
- ✅ Any number of spaces or line breaks within questions/explanations

---

## Sample Question Formats

### Format 1: Multi-line Question with Explanation

```
1. What is the capital of India?
A) Mumbai
B) Delhi
C) Kolkata
D) Chennai
Ans: B
Explanation: Delhi is the capital of India. It became the capital in 1911 during the British rule, replacing Calcutta.
It is located in the northern part of India and serves as the seat of the Indian government.
```

**Result:** Question text and explanation are both captured completely across multiple lines.

---

### Format 2: Multi-line Question with Reason

```
2. Which planet is known as the Red Planet?
A) Venus
B) Jupiter
C) Mars
D) Saturn
Ans: C
Reason: Mars is called the Red Planet because of iron oxide (rust) on its surface,
which gives it a reddish appearance.
```

**Result:** "Reason:" is recognized as an explanation keyword.

---

### Format 3: Multi-line Question with Solution

```
3. Who wrote the national anthem of India?
A) Rabindranath Tagore
B) Bankim Chandra Chatterjee
C) Sarojini Naidu
D) Subramania Bharati
Ans: A
Solution: Rabindranath Tagore wrote "Jana Gana Mana" which was adopted as the national anthem
of India on January 24, 1950.
```

**Result:** "Solution:" is recognized as an explanation keyword.

---

### Format 4: Multi-line Question Text

```
4. When was Pravasi Bhartiya 
Divas held in Varanasi? 
A) 2017 
B) 2015 
C) 2019 
D) 2020 
Ans: C
```

**Result:** Question text is merged: "When was Pravasi Bhartiya Divas held in Varanasi?"

---

### Format 5: Multi-line Options

```
5. What is the full form of DRDL? 
A) Differential Research and Documentation Laboratory
B) Department of Research and Development Laboratory 
C) Defense Research and Development Laboratory
D) None of the above
Ans: B
```

**Result:** Long options are captured completely.

---

## Complete Example with All Features

```
1. What is the chemical symbol for gold?
A) Go
B) Gd
C) Au
D) Ag
Ans: C
Explanation: The chemical symbol Au comes from the Latin word "aurum" meaning gold.
Gold is a precious metal with atomic number 79.
It has been used by humans for over 5,000 years.

2. Which is the smallest continent in the world?
A) Europe
B) Australia
C) Antarctica
D) South America
Ans: B
Reason: Australia is the smallest continent and also the oldest, flattest, and driest
inhabited continent on Earth. It is also a country and a continent.

3. What is the largest ocean on Earth?
A) Atlantic Ocean
B) Indian Ocean
C) Arctic Ocean
D) Pacific Ocean
Ans: D
Explanation: The Pacific Ocean is the largest and deepest ocean on Earth,
covering more than 30% of the Earth's surface area.
It extends from the Arctic Ocean in the north to the Southern Ocean in the south.
```

---

## Key Rules

1. **Question Numbers:** Start with `1.`, `2.`, etc. or `Q1.`, `Q2.`, etc.
2. **Options:** Use `A)`, `B)`, `C)`, `D)` format
3. **Answer:** Use `Ans: A/B/C/D` or `Answer: A/B/C/D`
4. **Explanation Keywords:** Use any of these:
   - `Explanation:`
   - `Reason:`
   - `Solution:`
5. **Line Breaks:** You can break lines anywhere in questions, options, or explanations
6. **Empty Lines:** Empty lines between questions are automatically handled

---

## What Gets Imported

For each question, the system captures:
- **Question Text:** Complete multi-line question
- **Options:** All 4 options (A, B, C, D)
- **Correct Answer:** The answer letter (A, B, C, or D)
- **Explanation:** Complete multi-line explanation (if provided)
- **Marks:** Default is 1 (can be set when importing)
- **Negative Marks:** Default is 0.25 (can be set when importing)

---

## Tips for Best Results

1. Keep questions numbered sequentially (1, 2, 3...)
2. Use consistent option format (A), B), etc.)
3. Always include `Ans:` or `Answer:` before the correct option
4. Explanations are optional but recommended
5. You can have as many lines as needed in explanations
6. The parser automatically handles extra spaces and blank lines