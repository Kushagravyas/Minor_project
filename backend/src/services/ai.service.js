const { GoogleGenerativeAI } = require('google-generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeAIModel({model: "gemini-2.0-flash"});



const prompt = "Explain how AI work?";

// const result = await model.generateContent(prompt);
// console.log(result.response.text());

async function generateContent(prompt) {

    const result = await model.generatecontent(prompt);
    return result.response.text();
    
}

module.exports = generateContent