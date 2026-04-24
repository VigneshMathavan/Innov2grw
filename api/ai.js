import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDemoContent(businessType, goal, channel, businessName) {
  const prompt = `
You are an expert AI Business Transformation Consultant working for "Innov2Grow".
The user wants to see a highly advanced, 5-module prototype of how Innov2Grow will scale their business.
Their inputs:
- Business Type: ${businessType}
- Business Name: ${businessName || "My Business"}
- Primary Goal: ${goal}
- Preferred Channel: ${channel}

Generate a complex JSON object exactly matching this schema. Make the data highly specific, professional, and realistic to their business context:
{
  "software": {
    "architecture": "A brief technical description of the web/app architecture needed for this business.",
    "files": [
      { "name": "index.html", "language": "html", "content": "Full semantic HTML5 structure for a landing page." },
      { "name": "styles.css", "language": "css", "content": "Beautiful modern CSS with gradients and flexbox/grid." },
      { "name": "app.js", "language": "javascript", "content": "Interactive JS logic (e.g., form handling, animations)." }
    ]
  },
  "marketing": {
    "adHeadline": "Catchy Facebook/Google ad headline",
    "adCopy": "Compelling 2-sentence ad copy.",
    "targetAudience": "Demographics and interests.",
    "roasMultiplier": 3.5, 
    "imagePrompt": "A highly detailed Midjourney image prompt for the ad creative."
  },
  "social": {
    "posts": [
      { "day": "Monday", "theme": "Educational", "caption": "...", "status": "Scheduled" },
      { "day": "Wednesday", "theme": "Behind the Scenes", "caption": "...", "status": "In Review" },
      { "day": "Friday", "theme": "Hard Sell", "caption": "...", "status": "To Do" }
    ]
  },
  "seo": {
    "reviews": [
      { "author": "John D.", "rating": 5, "text": "Great service!", "sentiment": "Positive", "keywords": ["service"], "aiResponse": "Thank you John!" },
      { "author": "Sarah M.", "rating": 3, "text": "It was okay, but hard to find parking.", "sentiment": "Mixed", "keywords": ["parking", "location"], "aiResponse": "Hi Sarah, thanks for the feedback. We are working on adding validated parking..." }
    ]
  },
  "automation": {
    "scenario": "A brief description of a manual task being automated.",
    "nodes": [
      { "id": "1", "type": "Trigger", "label": "New Lead in Facebook Forms" },
      { "id": "2", "type": "Action", "label": "AI Sentiment & Intent Scoring" },
      { "id": "3", "type": "Action", "label": "Insert into CRM & Notify Team" }
    ]
  }
}
Generate ONLY valid JSON. No markdown formatting, no code blocks, just raw JSON text.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return {
      data: JSON.parse(text),
      prompt: prompt,
      isFallback: false
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      data: {
        "software": {
          "architecture": "React frontend with a scalable Node.js/Express backend and PostgreSQL database.",
          "files": [
            { "name": "index.html", "language": "html", "content": "<!DOCTYPE html>\n<html>\n<head><title>My App</title></head>\n<body><h1>Hello Innov2Grow</h1></body>\n</html>" },
            { "name": "styles.css", "language": "css", "content": "body { background: #000; color: #fff; font-family: sans-serif; text-align: center; margin-top: 50px; }" },
            { "name": "app.js", "language": "javascript", "content": "console.log('App initialized');" }
          ]
        },
        "marketing": {
          "adHeadline": "Scale Your Business Today",
          "adCopy": "Stop wasting time on manual tasks. Let AI do the heavy lifting.",
          "targetAudience": "Business owners aged 30-55",
          "roasMultiplier": 3.0,
          "imagePrompt": "Cinematic shot of a business owner looking at a laptop with upward trending charts, neon blue accents."
        },
        "social": {
          "posts": [
            { "day": "Monday", "theme": "Welcome", "caption": "Hello world! We are excited to launch.", "status": "Scheduled" }
          ]
        },
        "seo": {
          "reviews": [
            { "author": "Test User", "rating": 5, "text": "Amazing!", "sentiment": "Positive", "keywords": ["amazing"], "aiResponse": "Thanks!" }
          ]
        },
        "automation": {
          "scenario": "Lead capture to CRM",
          "nodes": [
            { "id": "1", "type": "Trigger", "label": "Form Submit" },
            { "id": "2", "type": "Action", "label": "Add to DB" }
          ]
        }
      },
      prompt: prompt,
      isFallback: true
    };
  }
}

export async function handleChat(messages, businessName, businessType) {
  const systemInstruction = `You are an expert sales consultant for "Innov2Grow". 
Your goal is to consult the user on how to scale their business (${businessName || businessType || 'their company'}).
Innov2Grow specializes in 5 core services: Software Development, Digital Marketing, Social Media Management, Google Business Optimization (Local SEO), and AI Automation.
Be concise, highly professional, persuasive, and ask questions to qualify the lead. Do not use markdown formatting heavily, keep it conversational.`;

  const formattedHistory = messages.map(msg => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: 'Understood. I will act as the Innov2Grow consultant.' }] },
        ...formattedHistory
      ],
    });
    
    return {
      text: response.text,
      isFallback: false
    };
  } catch (error) {
    console.error("AI Chat Error:", error);
    return {
      text: "I'm currently experiencing high volume, but I'd love to discuss our AI Automation services with you on a quick call.",
      isFallback: true
    };
  }
}

export async function handleRewrite(section, currentData, instruction, businessName, businessType) {
  const prompt = `
You are an AI working for Innov2Grow. You need to rewrite a specific section of a business transformation dashboard based on user feedback.
Business: ${businessName || businessType || 'A company'}
Section to rewrite: ${section}
Current Data: ${JSON.stringify(currentData)}
User Instruction: ${instruction}

Generate ONLY valid JSON matching the exact schema of the 'Current Data' provided. Do not include markdown formatting or code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return {
      data: JSON.parse(text),
      isFallback: false
    };
  } catch (error) {
    console.error("AI Rewrite Error:", error);
    return {
      data: currentData,
      isFallback: true
    };
  }
}

export async function handleNodeExecution(nodeLabel, payload) {
  const prompt = `
You are an AI executing a specific action in an automated workflow.
Your Task: "${nodeLabel}"
Input Data Payload: ${JSON.stringify(payload)}

Execute the task based on the input data. 
Return ONLY a valid JSON object containing the results of your execution. Do not include markdown formatting or code blocks.
Make the JSON keys descriptive of the extracted or generated data (e.g., {"sentiment": "High", "extractedName": "John"}).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return {
      result: JSON.parse(text),
      isFallback: false
    };
  } catch (error) {
    console.error("AI Node Execution Error:", error);
    return {
      result: { error: "Execution failed due to missing API key or timeout." },
      isFallback: true
    };
  }
}

export async function handleCodeGeneration(promptText) {
  const prompt = `
You are an expert AI Frontend Developer. The user has provided the following prompt for a website:
"${promptText}"

Generate the HTML, CSS, and JS files for this website. Ensure the design is modern, visually stunning, dark-themed, and responsive.
Return ONLY a valid JSON array of objects representing the files. Do not include markdown formatting or code blocks outside the JSON array.
Each object must have exactly these keys: "name", "language", and "content".
Example format:
[
  { "name": "index.html", "language": "html", "content": "<!DOCTYPE html>..." },
  { "name": "styles.css", "language": "css", "content": "body { ... }" },
  { "name": "app.js", "language": "javascript", "content": "console.log('hi');" }
]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return {
      files: JSON.parse(text),
      isFallback: false
    };
  } catch (error) {
    console.error("AI Code Generation Error:", error);
    return {
      files: [
        { 
          "name": "index.html", 
          "language": "html", 
          "content": "<!DOCTYPE html><html><body><h1>Innov2Grow Demo</h1><p>Our AI is currently polishing your custom site. Please check back in a moment!</p></body></html>" 
        }
      ],
      isFallback: true
    };
  }
}

export async function handlePostEnhancement(draft) {
  const prompt = `
You are an expert Social Media Manager. The user has provided a short, rough draft for a social media post:
"${draft}"

Expand this into a highly engaging, detailed, and viral social media caption.
Include emojis, line breaks for readability, a clear call-to-action (CTA), and 3-5 relevant hashtags.
Return ONLY the final expanded caption as raw text. Do not use markdown blocks or quotes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return {
      enhancedText: response.text.trim(),
      isFallback: false
    };
  } catch (error) {
    console.error("AI Post Enhancement Error:", error);
    return {
      enhancedText: `${draft}\n\n✨ Let's scale your business to the next level today! #BusinessGrowth #AI`,
      isFallback: true
    };
  }
}
