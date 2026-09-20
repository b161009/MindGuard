import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRiskScore, RISK_LEVEL } from '../src/services/ai/riskScore.js';
import { analyzeTrend } from '../src/services/ai/trendAnalysis.js';

const steadyAnswers = { mood: 8, comfort: 8, stress: 2, sleep: 8, energy: 8, interest: 8, social: 7 };

test('risk score stays normal for a steady check-in', () => {
  const result = calculateRiskScore(steadyAnswers, { signalScore: 0, detectedSignals: [], needsHumanFollowUp: false });
  assert.equal(result.level, RISK_LEVEL.NORMAL);
  assert.equal(result.score, 0);
});

test('urgent safety signal always requests human follow-up', () => {
  const result = calculateRiskScore(steadyAnswers, { signalScore: 40, detectedSignals: [{ label: 'Cần hỗ trợ an toàn' }], needsHumanFollowUp: true });
  assert.equal(result.level, RISK_LEVEL.SUPPORT);
  assert.equal(result.needsHumanFollowUp, true);
  assert.equal(result.score, 100);
});

test('trend analysis orders entries by date before comparing periods', () => {
  const entries = [
    { dateKey: '2026-09-20', mood: 4, stress: 8, riskScore: 60, riskLevel: RISK_LEVEL.WATCH },
    { dateKey: '2026-09-14', mood: 8, stress: 2, riskScore: 5, riskLevel: RISK_LEVEL.NORMAL },
    { dateKey: '2026-09-17', mood: 6, stress: 5, riskScore: 25, riskLevel: RISK_LEVEL.WATCH },
  ];
  const result = analyzeTrend(entries);
  assert.equal(result.hasEnoughData, true);
  assert.equal(result.risingRisk, true);
});
