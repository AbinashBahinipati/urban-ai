require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    console.log("Testing Gemini API with key:", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        console.log("Attempting gemini-1.0-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        console.log("SUCCESS! gemini-1.0-pro response:", response.text());
    } catch (error) {
        console.error("FAILURE with gemini-1.0-pro. Error:", error.message);
    }
}

test();
