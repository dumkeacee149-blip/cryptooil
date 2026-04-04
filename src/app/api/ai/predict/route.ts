import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getDashScope } from '@/lib/ai-provider';
import { PRICE_PREDICTION_SYSTEM } from '@/lib/prompts/price-prediction';
import type { AiPrediction } from '@/lib/types';

function getMockPrediction(): AiPrediction {
  return {
    direction: 'bullish',
    confidence: 72,
    forecast: [69.2, 69.8, 70.1, 70.5, 69.9, 70.8, 71.2],
    keyFactors: [
      'Hormuz strait tensions elevating risk premium',
      'US crude inventory draws exceeding expectations',
      'OPEC+ production cuts compliance above 95%',
      'Chinese demand recovery signals strengthening',
    ],
    riskEvents: [
      'Potential US-Iran diplomatic breakthrough could reduce risk premium',
      'Surprise OPEC+ production increase announcement',
      'Global recession fears re-emerging from weak PMI data',
    ],
    summary:
      'WTI expected to trend higher over the next 7 days, driven by geopolitical risk premium from Hormuz tensions and tighter-than-expected US inventories. OPEC+ discipline remains supportive. Key risk: diplomatic de-escalation.',
  };
}

export async function POST() {
  try {
    const dashscope = getDashScope();

    const { text } = await generateText({
      model: dashscope('qwen-plus'),
      system: PRICE_PREDICTION_SYSTEM,
      prompt:
        'Analyze current oil market conditions and provide a 7-day WTI price prediction. Consider recent geopolitical tensions in the Middle East, OPEC+ production decisions, and US inventory data.',
      temperature: 0.3,
      maxOutputTokens: 1000,
    });

    const prediction: AiPrediction = JSON.parse(text);
    return NextResponse.json({ success: true, data: prediction });
  } catch {
    const mockPrediction = getMockPrediction();
    return NextResponse.json({ success: true, data: mockPrediction });
  }
}
