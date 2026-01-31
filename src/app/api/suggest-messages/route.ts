import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json().catch(() => ({}));
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // Stable v1 URL for Gemini
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `User Topic: "${userInput || 'general'}". Generate 3 short anonymous questions. Format: q1||q2||q3. No numbers.`
          }]
        }]
      })
    });

    const data = await response.json();

    // Agar AI se data mil gaya toh use return karo
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ text: data.candidates[0].content.parts[0].text.trim() });
    }

    // Agar AI response mein error hai toh catch block handle karega
    throw new Error("AI Fallback Triggered");

  } catch (error) {
    // Resume Safe Fallbacks - Ye humesha 3 questions dikhayenge
    const fallbackOptions = [
      "What's your biggest dream in life?||Coffee or tea person?||Your favorite travel destination?",
      "What is a secret talent you have?||If you could meet any celebrity, who?||Best advice you ever got?",
      "Which movie can you watch on repeat?||Your go-to comfort food?||Morning person or night owl?",
     
    ];

    // Randomly pick one set to keep it dynamic
    const randomFallback = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
    
    return NextResponse.json({ text: randomFallback });
  }
}