import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getDashScope } from '@/lib/ai-provider';
import { CHAT_ANALYSIS_SYSTEM } from '@/lib/prompts/price-prediction';

interface ChatMessage {
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: readonly ChatMessage[] = body.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json({ content: 'No message provided.' }, { status: 400 });
    }

    const dashscope = getDashScope();

    const { text } = await generateText({
      model: dashscope('qwen-turbo'),
      system: CHAT_ANALYSIS_SYSTEM,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.5,
      maxOutputTokens: 500,
    });

    return NextResponse.json({ content: text });
  } catch {
    return NextResponse.json({
      content:
        'AI engine temporarily offline. The DashScope API key may not be configured. Please set DASHSCOPE_API_KEY in .env.local.',
    });
  }
}
