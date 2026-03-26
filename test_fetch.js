require('dotenv').config();

async function testFetch() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    
    console.log("Testing Gemini API (v1beta) with new key:", key.substring(0, 10) + "...");
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello! Are you online?" }] }]
            })
        });
        
        const data = await response.json();
        console.log("Status:", response.status);
        if (response.status === 200) {
            console.log("SUCCESS! Result:", data.candidates[0].content.parts[0].text);
        } else {
            console.log("Error Body:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

listModels();
