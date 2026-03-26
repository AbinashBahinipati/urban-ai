const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const key = "AIzaSyAJJXs-f24lzEDJ2O7wa5CfYNxczGXcO78";
    const modelName = "gemini-flash-latest";
    console.log(`Testing Gemini API with model: ${modelName}...`);
    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        console.log(`SUCCESS! result: ${response.text()}`);
    } catch (error) {
        console.error("FAILURE Error: ", error.message);
    }
}

test();
