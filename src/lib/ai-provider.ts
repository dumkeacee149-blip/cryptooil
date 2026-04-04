import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { DASHSCOPE_BASE_URL } from '@/lib/constants';

function getDashScopeKey(): string {
  const key = process.env.DASHSCOPE_API_KEY;
  if (!key) {
    throw new Error('DASHSCOPE_API_KEY environment variable is not configured');
  }
  return key;
}

export function getDashScope() {
  return createOpenAICompatible({
    name: 'dashscope',
    baseURL: DASHSCOPE_BASE_URL,
    apiKey: getDashScopeKey(),
  });
}
