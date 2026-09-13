import { analyzeText } from './nlp';

// Kept as a small baseline adapter for later local Vietnamese ML comparison.
export function getSentimentScore(text = '') {
  const { emotion, detectedSignals } = analyzeText(text);
  const labels = { 'tích cực': 0.75, 'trung tính': 0.5, 'chưa xác định': 0.5, 'căng thẳng': 0.35, 'buồn': 0.28, 'mệt mỏi': 0.38 };
  return { score: labels[emotion] ?? 0.5, label: emotion, signals: detectedSignals };
}
