import OpenAI from "openai";



export const getBulkFeedback = async (req, res) => {
  try {

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,  // Sử dụng biến môi trường từ .env
    });
    
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Bro... that's not even an array 😩" });
    }

    // Construct a single prompt for all answers
    let prompt = "You're a friendly teacher. Give a short feedback to help this student improve.\n\n\n\n";
    let content1 = "You're a kind and helpful teacher.";
    answers.forEach((item, index) => {
      if (item.isCorrect) return; // skip correct answers

      prompt += `
        Question ${index + 1}:
        ${item.question}
        Student's Answer: ${item.studentAnswer}
        Correct Answer: ${item.correctAnswer}
        Feedback: 
      `;
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: content1 },
        { role: "user", content: prompt },
      ],
    });

    // Return the feedback content in the response
    return res.status(200).json({ feedback: response.choices[0].message.content });

  } catch (error) {
    console.error("💥 Feedback Error:", error);
    return res.status(500).json({ error: "Oops 😵 Something broke while generating feedbacks." });
  }
};
