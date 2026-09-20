const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const RISK_LEVEL = {
  NORMAL: 'Bình thường',
  WATCH: 'Cần chú ý',
  SUPPORT: 'Nên tìm hỗ trợ',
};

/** Transparent temporary screening score; it is not a clinical assessment. */
export function calculateRiskScore(answers, textAnalysis = {}) {
  const { mood, comfort, stress, sleep, energy, interest, social } = answers;
  const factors = [
    { key: 'stress', label: 'mức căng thẳng cao', points: Math.max(0, Number(stress) - 3) * 3.2, active: Number(stress) >= 7 },
    { key: 'mood', label: 'tâm trạng thấp', points: Math.max(0, 6 - Number(mood)) * 3.2, active: Number(mood) <= 3 },
    { key: 'comfort', label: 'mức dễ chịu thấp', points: Math.max(0, 6 - Number(comfort)) * 2, active: Number(comfort) <= 3 },
    { key: 'sleep', label: 'giấc ngủ chưa phục hồi', points: Math.max(0, 6 - Number(sleep)) * 2.5, active: Number(sleep) <= 3 },
    { key: 'energy', label: 'năng lượng thấp', points: Math.max(0, 6 - Number(energy)) * 2.5, active: Number(energy) <= 3 },
    { key: 'interest', label: 'mức hứng thú với hoạt động hằng ngày thấp', points: Math.max(0, 6 - Number(interest ?? 5)) * 2, active: Number(interest ?? 5) <= 3 },
    { key: 'social', label: 'ít mong muốn kết nối', points: Math.max(0, 4 - Number(social)), active: Number(social) <= 2 },
  ];
  const quantitativeScore = factors.reduce((total, factor) => total + factor.points, 0);
  const textScore = Math.min(22, Number(textAnalysis.signalScore || 0));
  const isUrgent = Boolean(textAnalysis.needsHumanFollowUp);
  const score = isUrgent ? 100 : Number(clamp(quantitativeScore + textScore).toFixed(0));
  const level = isUrgent || score >= 60 ? RISK_LEVEL.SUPPORT : score >= 25 ? RISK_LEVEL.WATCH : RISK_LEVEL.NORMAL;
  const reasons = factors.filter((factor) => factor.active).map((factor) => factor.label);
  if (textAnalysis.detectedSignals?.length) reasons.push(...textAnalysis.detectedSignals.map((signal) => signal.label));

  return {
    score,
    level,
    needsHumanFollowUp: isUrgent,
    reasons: reasons.slice(0, 4),
    breakdown: { quantitativeScore: Number(quantitativeScore.toFixed(1)), textScore, factors: factors.map(({ key, label, points }) => ({ key, label, points: Number(points.toFixed(1)) })) },
  };
}
