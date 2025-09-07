import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateAIResponse(userMessage: string, context: string = ''): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI assistant for StatusBoard, a platform where users signal their availability for startup tasks and showcase services. You help users refine their service offerings and scope client requests. Be concise, friendly, and actionable. Context: ${context}`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now. Please try again.';
  } catch (error) {
    console.error('AI response error:', error);
    return 'I apologize, but I cannot process your request right now. Please try again.';
  }
}

export function generateTaskPrompt(serviceCategory: string, userName: string): string {
  const prompts = {
    scoping: `Ready to start scoping with ${userName}?`,
    deployment: `Ready to begin deployment planning with ${userName}?`,
    brainstorming: `Ready to dive into brainstorming with ${userName}?`,
    'feature-addition': `Ready to discuss feature additions with ${userName}?`
  };

  return prompts[serviceCategory as keyof typeof prompts] || `Ready to get started with ${userName}?`;
}
