/**
 * SumoPod AI Service
 * Compatible with OpenAI API format
 * Updated based on latest 2026 Dashboard Research
 */

import { SUMOPOD_MODELS } from '../utils/constants';

export async function generateSumopodContent(
  apiKey: string,
  model: string,
  messages: { role: 'user' | 'assistant' | 'system', content: string }[],
  options: { temperature?: number, max_tokens?: number } = {}
) {
  let modelsToTry = [model];

  // Logic Auto-Budget untuk mencari model terbaik yang paling hemat
  if (model === 'auto-budget') {
    modelsToTry = [
      'seed-2-0-lite-free',
      'glm-5-code',
      'gemini/gemini-2.0-flash-lite',
      'gpt-4o-mini',
      'deepseek-v3-2',
      'gpt-4.1-mini'
    ];
  }

  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      const response = await fetch('https://ai.sumopod.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: currentModel,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 16384,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `SumoPod API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.warn(`[SumoPod Auto-Budget] Model ${currentModel} failed: ${error.message}`);
      lastError = error;
      
      if (model !== "auto-budget") break;
    }
  }

  throw new Error(lastError?.message || 'All SumoPod fallback models failed.');
}
