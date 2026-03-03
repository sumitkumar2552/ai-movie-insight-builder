// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function analyzeSentiment(reviews: string[]) {
//   try {
//     if (!reviews || reviews.length === 0) {
//       return "No reviews available to analyze.";
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",
//     });

//     const prompt = `
// Analyze the following audience reviews.

// 1. Provide a short summary (6-7 lines).
// 2. Then strictly classify overall sentiment as one word only:
//    Positive
//    Mixed
//    Negative

// If majority reviews are critical, choose Negative.
// If balanced, choose Mixed.
// If majority praise, choose Positive.

// Return plain text only.
// ${reviews.join("\n\n")}
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     return response.text() || "Sentiment analysis failed.";
//   } catch (error) {
//     console.error("Gemini SDK Error:", error);
//     return "Sentiment analysis failed.";
//   }
// }





import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeSentiment(reviews: string[]) {
  try {
    if (!reviews || reviews.length === 0) {
      return "No reviews available to analyze.";
    }

    const prompt = `
Analyze the following audience reviews.

1. Provide a short summary (7-8 lines).
2. Then strictly classify overall sentiment as one word only:
   Positive
   Mixed
   Negative

If majority reviews are critical, choose Negative.
If balanced, choose Mixed.
If majority praise, choose Positive.

Return plain text only.
${reviews.join("\n\n")}
`;

    const completion = await client.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: "You are a movie sentiment analyst." },
    { role: "user", content: prompt },
  ],
  temperature: 0.7,
});

    return completion.choices[0].message.content || "Analysis failed.";
  } catch (error) {
    console.error("Groq Error:", error);
    return "Sentiment analysis failed.";
  }
}