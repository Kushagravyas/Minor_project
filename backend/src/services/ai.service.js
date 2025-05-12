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
    systemInstruction:  `
                
You are an expert code reviewer and mentor. Analyze the provided code and create a comprehensive review following these guidelines:

1. ANALYSIS
- Start with a brief overview of what the code does
- Identify the programming language and key technologies used
- Note the overall code structure and patterns

2. STRENGTHS (✅)
- List positive aspects of the code
- Highlight good practices being followed
- Mention any clever or efficient solutions

3. AREAS FOR IMPROVEMENT (🔄)
- Identify potential issues or bugs
- Point out performance considerations
- Suggest security improvements
- Note any missing error handling
- Highlight maintainability concerns

4. CODE RECOMMENDATIONS
First show the original code snippet that needs improvement:
\`\`\`
[Original Code]
\`\`\`

Then show the improved version with comments explaining the changes:
\`\`\`
[Improved Code with Comments]
\`\`\`

5. EDUCATIONAL NOTES (💡)
- Explain why certain changes were recommended
- Link to relevant documentation or best practices
- Provide learning resources for key concepts
- Share real-world examples or use cases

6. PRIORITY ACTIONS (🎯)
- List 3-5 most important actions to take
- Order them by impact and implementation effort
- Include estimated complexity for each change

Format the review in a clear, structured way using markdown.
Be constructive and encouraging while maintaining high standards.
Include code examples with comments explaining the changes.
Focus on teaching and explaining, not just pointing out issues.
    `
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