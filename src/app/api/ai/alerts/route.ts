import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getDashScope } from '@/lib/ai-provider';
import { ALERT_GENERATION_SYSTEM } from '@/lib/prompts/price-prediction';
import type { Alert } from '@/lib/types';

function getMockAlerts(): readonly Alert[] {
  return [
    {
      id: `alert-${Date.now()}-1`,
      type: 'GEOPOLITICAL_ESCALATION',
      severity: 'WARNING',
      title: 'Hormuz Strait Tension Elevated',
      description:
        'IRGC naval exercises detected near Strait of Hormuz. Oil tanker rerouting observed.',
      timestamp: new Date().toISOString(),
      relatedAsset: 'WTI',
    },
    {
      id: `alert-${Date.now()}-2`,
      type: 'SUPPLY_DISRUPTION',
      severity: 'CRITICAL',
      title: 'Libya Pipeline Shutdown',
      description:
        'Armed groups forced shutdown of El Sharara oilfield. 300K bbl/day offline.',
      timestamp: new Date().toISOString(),
      relatedAsset: 'BRENT',
    },
    {
      id: `alert-${Date.now()}-3`,
      type: 'PRICE_SPIKE',
      severity: 'INFO',
      title: 'WTI Above 30-Day MA',
      description:
        'WTI crude crossed above 30-day moving average, signaling potential uptrend.',
      timestamp: new Date().toISOString(),
      relatedAsset: 'WTI',
    },
  ];
}

export async function POST() {
  try {
    const dashscope = getDashScope();

    const { text } = await generateText({
      model: dashscope('qwen-turbo'),
      system: ALERT_GENERATION_SYSTEM,
      prompt:
        'Generate alerts based on current oil market conditions: Hormuz tensions elevated, Libya oilfield shutdown, WTI trading above 30-day moving average, OPEC+ meeting this week.',
      temperature: 0.3,
      maxOutputTokens: 800,
    });

    const rawAlerts = JSON.parse(text);
    const alerts: readonly Alert[] = rawAlerts.map(
      (a: Record<string, string>, i: number) => ({
        ...a,
        id: `alert-${Date.now()}-${i}`,
        timestamp: new Date().toISOString(),
      })
    );

    return NextResponse.json({ success: true, data: alerts });
  } catch {
    return NextResponse.json({ success: true, data: getMockAlerts() });
  }
}
