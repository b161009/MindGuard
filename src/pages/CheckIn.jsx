import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import MoodSlider from '../components/checkin/MoodSlider';
import DiaryInput from '../components/checkin/DiaryInput';
import { useAuth } from '../hooks/useAuth';
import { saveCheckIn } from '../services/firebase/firestore';
import { analyzeText } from '../services/ai/nlp';
import { calculateRiskScore } from '../services/ai/riskScore';
import { generateFeedback } from '../services/feedback/feedbackGenerator';
import { getDateKey } from '../utils/date';

const initialForm = { mood: 6, comfort: 6, stress: 5, sleep: 6, energy: 6, social: 6, reflection: '' };

export default function CheckIn() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const update = (field) => (value) => setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      const textAnalysis = analyzeText(form.reflection);
      const assessment = calculateRiskScore(form, textAnalysis);
      const feedback = generateFeedback(assessment);
      const entry = {
        date: new Date().toISOString(),
        dateKey: getDateKey(),
        mood: form.mood,
        comfort: form.comfort,
        stress: form.stress,
        sleep: form.sleep,
        energy: form.energy,
        social: form.social,
        content: form.reflection.trim(),
        riskScore: assessment.score,
        emotion: textAnalysis.emotion,
        riskLevel: assessment.level,
        detectedSignals: textAnalysis.detectedSignals,
        explanation: { reasons: assessment.reasons, breakdown: assessment.breakdown },
        needsHumanFollowUp: assessment.needsHumanFollowUp,
        feedback,
      };
      const savedEntry = await saveCheckIn(user.uid, entry);
      navigate('/result', { state: { entry: savedEntry }, replace: true });
    } catch {
      setError('Chưa thể lưu check-in. Hãy kiểm tra kết nối và thử lại nhé.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="container checkin-container">
        <div className="page-intro">
          <span className="eyebrow">CHECK-IN HÔM NAY</span>
          <h1>Hôm nay bạn thế nào?</h1>
          <p>Không có câu trả lời đúng. Hãy chọn mức gần với trải nghiệm của bạn nhất.</p>
        </div>
        <form className="checkin-form" onSubmit={handleSubmit}>
          <section className="question-group">
            <MoodSlider label="Tâm trạng của bạn lúc này" value={form.mood} onChange={update('mood')} />
            <MoodSlider label="Bạn cảm thấy dễ chịu, thư thái đến mức nào?" value={form.comfort} onChange={update('comfort')} />
            <MoodSlider label="Mức độ căng thẳng của bạn" value={form.stress} onChange={update('stress')} />
          </section>
          <section className="question-group">
            <MoodSlider label="Giấc ngủ đêm qua giúp bạn hồi phục đến mức nào?" value={form.sleep} onChange={update('sleep')} />
            <MoodSlider label="Năng lượng của bạn hôm nay" value={form.energy} onChange={update('energy')} />
            <MoodSlider label="Bạn muốn giao tiếp, kết nối với người khác đến mức nào?" value={form.social} onChange={update('social')} />
          </section>
          <DiaryInput value={form.reflection} onChange={update('reflection')} />
          <aside className="privacy-note">
            <span aria-hidden="true">⌁</span>
            <p>Mind Guard chỉ hỗ trợ bạn quan sát thay đổi, không chẩn đoán. Nếu bạn thấy mình không an toàn, hãy mở nút <strong>Hỗ trợ</strong> ngay.</p>
          </aside>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="submit-row">
            <p className="muted small">Mất khoảng 1 phút · Bạn có thể cập nhật lại trong ngày.</p>
            <Button type="submit" disabled={submitting}>{submitting ? 'Đang lưu…' : 'Hoàn thành check-in'}</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
