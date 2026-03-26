require('dotenv').config();
const https = require('https');

async function testModel(model) {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    console.log(`Testing model: ${model}...`);
    
    const promise = new Promise((resolve) => {
        const data = JSON.stringify({ contents: [{ parts: [{ text: "Hello!" }] }] });
        const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ code: res.statusCode, body }));
        });
        req.on('error', (e) => resolve({ error: e.message }));
        req.write(data);
        req.end();
    });
    
    const result = await promise;
    console.log(`Model: ${model} - Status: ${result.code}`);
    if (result.code !== 200) {
        console.log(`Error body: ${result.body}`);
    } else {
        console.log(`SUCCESS with ${model}`);
    }
}

async function runTests() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-flash-latest");
    await testModel("gemini-1.5-flash-8b");
    await testModel("gemini-1.5-pro");
}

runTests();
