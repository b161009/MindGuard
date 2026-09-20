import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import MoodSlider from '../components/checkin/MoodSlider';
import DiaryInput from '../components/checkin/DiaryInput';
import { useAuth } from '../hooks/useAuth';
import { saveCheckIn } from '../services/firebase/firestore';
import { analyzeCheckIn } from '../services/ai/localClient';
import { generateFeedback } from '../services/feedback/feedbackGenerator';
import { getDateKey } from '../utils/date';

const initialForm = { mood: 6, comfort: 6, stress: 5, sleep: 6, energy: 6, interest: 6, social: 6, reflection: '' };
const questions = [
  { field: 'mood', icon: '☼', label: 'Hôm nay, bạn cảm thấy vui vẻ và có tinh thần tốt đến mức nào?', lowLabel: 'Rất ít', highLabel: 'Rất nhiều' },
  { field: 'comfort', icon: '⌁', label: 'Hôm nay, bạn cảm thấy bình tĩnh và thư thái đến mức nào?', lowLabel: 'Rất ít', highLabel: 'Rất nhiều' },
  { field: 'energy', icon: '✦', label: 'Hôm nay, bạn cảm thấy hoạt bát và có năng lượng đến mức nào?', lowLabel: 'Rất ít', highLabel: 'Rất nhiều' },
  { field: 'sleep', icon: '☾', label: 'Bạn thức dậy với cảm giác tươi tỉnh và được nghỉ ngơi đến mức nào?', lowLabel: 'Chưa hồi phục', highLabel: 'Rất hồi phục' },
  { field: 'interest', icon: '✳', label: 'Các hoạt động hằng ngày có ý nghĩa hoặc khiến bạn hứng thú đến mức nào?', lowLabel: 'Rất ít', highLabel: 'Rất nhiều' },
  { field: 'social', icon: '◌', label: 'Bạn mong muốn kết nối, trò chuyện với người khác đến mức nào?', lowLabel: 'Không muốn', highLabel: 'Rất muốn' },
];

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
      const { textAnalysis, assessment, source } = await analyzeCheckIn(form);
      const feedback = generateFeedback(assessment);
      const entry = {
        date: new Date().toISOString(),
        dateKey: getDateKey(),
        mood: form.mood,
        comfort: form.comfort,
        stress: form.stress,
        sleep: form.sleep,
        energy: form.energy,
        interest: form.interest,
        social: form.social,
        content: form.reflection.trim(),
        riskScore: assessment.score,
        emotion: textAnalysis.emotion,
        riskLevel: assessment.level,
        detectedSignals: textAnalysis.detectedSignals,
        explanation: { reasons: assessment.reasons, breakdown: assessment.breakdown },
        needsHumanFollowUp: assessment.needsHumanFollowUp,
        analysisSource: source,
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
          <p>Không có câu trả lời đúng. Hãy chọn mức gần với trải nghiệm của bạn nhất hôm nay.</p>
        </div>
        <form className="checkin-form" onSubmit={handleSubmit}>
          <div className="checkin-progress" aria-label="Tiến độ check-in"><span>6 câu hỏi</span><div><i /><i /><i /><i /><i /><i /></div><span>Khoảng 1 phút</span></div>
          <section className="question-group">
            {questions.map((question) => <MoodSlider key={question.field} id={`checkin-${question.field}`} {...question} value={form[question.field]} onChange={update(question.field)} />)}
          </section>
          <section className="context-question panel"><div><span className="checkin-icon" aria-hidden="true">≈</span><div><p className="eyebrow">CĂNG THẲNG</p><h3>Mức độ căng thẳng của bạn hôm nay</h3></div></div><MoodSlider id="checkin-stress" label="Mức căng thẳng" icon="≈" value={form.stress} onChange={update('stress')} lowLabel="Không căng thẳng" highLabel="Rất căng thẳng" /></section>
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
