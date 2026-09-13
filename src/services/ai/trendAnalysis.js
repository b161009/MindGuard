const average = (values) => values.length ? values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length : null;

const analyzeWindow = (entries) => ({
  count: entries.length,
  mood: average(entries.map((entry) => entry.mood)),
  stress: average(entries.map((entry) => entry.stress)),
  risk: average(entries.map((entry) => entry.riskScore)),
});

export function analyzeTrend(history = []) {
  const entries = [...history].sort((a, b) => String(a.dateKey).localeCompare(String(b.dateKey)));
  const last7 = entries.slice(-7);
  const last30 = entries.slice(-30);
  const midpoint = Math.floor(last7.length / 2);
  const earlier = average(last7.slice(0, midpoint).map((entry) => entry.riskScore));
  const recent = average(last7.slice(midpoint).map((entry) => entry.riskScore));
  const sustainedWatchDays = last7.filter((entry) => entry.riskLevel !== 'Bình thường').length;
  const risingRisk = earlier !== null && recent !== null && recent - earlier >= 12;
  const sustained = sustainedWatchDays >= 3;
  const hasEnoughData = last7.length >= 3;

  return {
    sevenDay: analyzeWindow(last7),
    thirtyDay: analyzeWindow(last30),
    hasEnoughData,
    risingRisk,
    sustained,
    summary: !hasEnoughData
      ? 'Cần thêm vài ngày check-in để nhận ra xu hướng cá nhân của bạn.'
      : (risingRisk || sustained)
        ? 'Một vài dấu hiệu cần chú ý đang kéo dài trong 7 ngày gần đây. Hãy cân nhắc chia sẻ với người bạn tin cậy hoặc chuyên gia.'
        : 'Các chỉ số 7 ngày gần đây nhìn chung chưa cho thấy thay đổi kéo dài đáng kể.',
  };
}
