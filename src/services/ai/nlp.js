const SIGNAL_PATTERNS = [
  { id: 'urgent-safety', label: 'Nội dung có thể cho thấy bạn đang không an toàn', weight: 40, urgent: true, patterns: ['tự tử', 'tu tu', 'muốn chết', 'không muốn sống', 'kết thúc tất cả', 'làm hại bản thân', 'tự làm đau mình'] },
  { id: 'hopelessness', label: 'Cảm giác tuyệt vọng hoặc bế tắc', weight: 10, patterns: ['tuyệt vọng', 'bế tắc', 'vô vọng', 'không lối thoát', 'vô dụng'] },
  { id: 'overload', label: 'Căng thẳng hoặc quá tải', weight: 7, patterns: ['quá tải', 'kiệt sức', 'căng thẳng', 'áp lực', 'mệt mỏi', 'không chịu nổi'] },
  { id: 'isolation', label: 'Cảm giác cô đơn hoặc muốn tách mình ra', weight: 7, patterns: ['cô đơn', 'một mình', 'không ai hiểu', 'không muốn gặp ai', 'tránh mọi người'] },
  { id: 'low-mood', label: 'Tâm trạng buồn hoặc chùng xuống', weight: 5, patterns: ['buồn', 'trống rỗng', 'chán nản', 'khóc', 'thất vọng'] },
];

const EMOTIONS = [
  { label: 'căng thẳng', words: ['căng thẳng', 'áp lực', 'lo lắng', 'quá tải'] },
  { label: 'buồn', words: ['buồn', 'trống rỗng', 'chán nản', 'khóc'] },
  { label: 'mệt mỏi', words: ['mệt', 'kiệt sức', 'uể oải', 'không còn năng lượng'] },
  { label: 'tích cực', words: ['vui', 'ổn', 'nhẹ nhõm', 'biết ơn', 'hạnh phúc'] },
];

function normalize(text) {
  return text.toLocaleLowerCase('vi-VN').replace(/\s+/g, ' ').trim();
}

/** Rule-based Vietnamese NLP baseline. It flags wording patterns only, not diagnoses. */
export function analyzeText(text = '') {
  const normalized = normalize(text);
  if (!normalized) {
    return { emotion: 'chưa xác định', detectedSignals: [], signalScore: 0, needsHumanFollowUp: false, summary: 'Bạn chưa chia sẻ thêm nội dung hôm nay.' };
  }

  const matchedSignals = SIGNAL_PATTERNS
    .filter((signal) => signal.patterns.some((pattern) => normalized.includes(pattern)))
    .map(({ id, label, weight, urgent }) => ({ id, label, weight, urgent: Boolean(urgent) }));
  const emotionScores = EMOTIONS.map((emotion) => ({ label: emotion.label, count: emotion.words.filter((word) => normalized.includes(word)).length }));
  const leadingEmotion = emotionScores.sort((a, b) => b.count - a.count)[0];

  return {
    emotion: leadingEmotion?.count ? leadingEmotion.label : 'trung tính',
    detectedSignals: matchedSignals.map(({ id, label }) => ({ id, label })),
    signalScore: matchedSignals.reduce((total, signal) => total + signal.weight, 0),
    needsHumanFollowUp: matchedSignals.some((signal) => signal.urgent),
    summary: matchedSignals.length
      ? 'Hệ thống nhận thấy một vài cụm từ đáng lưu tâm trong phần chia sẻ.'
      : 'Phần chia sẻ của bạn đã được ghi nhận để theo dõi cùng các check-in sau.',
  };
}
