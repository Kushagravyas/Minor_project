// const { GoogleGenerativeAI } = require('@google/generative-ai');
// require('dotenv').config();

// // Initialize the AI with API key
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// // Get the model (changed from getGenerativeAIModel to getGenerativeModel)
// const model = genAI.getGenerativeModel({
//      model: "gemini-2.0-flash", 
    //  systemInstruction: `
    //  you are a code reviewer, who have an experties in development, you look for the code and find the problems and suggest the solution to the developer.
     
    //  you always try to find the best solution for the developer and also try to make the code more efficient and clean.`
//     });

// async function generateContent(prompt) {
//     try {
//         if (!prompt) {
//             throw new Error('Prompt is required');
//         }

//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         return response.text();
//     } catch (error) {
//         console.error('AI Generation Error:', error);
//         throw error;
//     }
// }

// module.exports = generateContent;

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');
require('dotenv').config();

if (!process.env.GOOGLE_GEMINI_KEY) {
    throw new Error('GOOGLE_GEMINI_KEY is not defined in environment variables');
}

// Initialize the AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// Get the model
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: `
     you are a code reviewer, who have an experties in development, you look for the code and find the problems and suggest the solution to the developer.
     
     you always try to find the best solution for the developer and also try to make the code more efficient and clean.`
});

async function generateContent(code) {
    try {
        if (!code) {
            throw new Error('Code input is required');
        }

        const prompt = `Please review this code and provide suggestions for improvement:
        
        ${code}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('AI Generation Error:', error);
        throw new Error(`Failed to generate AI response: ${error.message}`);
    }
}

module.exports = generateContent;