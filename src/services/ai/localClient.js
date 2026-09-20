import { analyzeText } from './nlp';
import { calculateRiskScore } from './riskScore';

const isLocalAiEnabled = import.meta.env.VITE_USE_LOCAL_AI === 'true';
const localAiUrl = import.meta.env.VITE_LOCAL_AI_URL || 'http://127.0.0.1:8000';

const isValidRemoteResult = (result) => result
  && typeof result === 'object'
  && result.textAnalysis
  && result.assessment
  && typeof result.assessment.score === 'number';

/**
 * Uses an on-device service only when explicitly enabled. The browser baseline
 * remains available so a local-service outage never blocks a check-in.
 */
export async function analyzeCheckIn(form) {
  const textAnalysis = analyzeText(form.reflection);
  const assessment = calculateRiskScore(form, textAnalysis);
  const fallback = { textAnalysis, assessment, source: 'browser-rule-baseline' };
  if (!isLocalAiEnabled) return fallback;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);
  try {
    const response = await fetch(`${localAiUrl.replace(/\/$/, '')}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        text: form.reflection,
        answers: {
          mood: form.mood,
          comfort: form.comfort,
          stress: form.stress,
          sleep: form.sleep,
          energy: form.energy,
          interest: form.interest,
          social: form.social,
        },
      }),
    });
    const result = response.ok ? await response.json() : null;
    return isValidRemoteResult(result) ? { ...result, source: result.source || 'local-ai' } : fallback;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}
