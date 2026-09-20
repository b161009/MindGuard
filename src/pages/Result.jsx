import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ResultCard from '../components/result/ResultCard';
import RiskLevel from '../components/result/RiskLevel';
import { useAuth } from '../hooks/useAuth';
import { getCheckIns } from '../services/firebase/firestore';

export default function Result() {
  const { state } = useLocation();
  const { user } = useAuth();
  const [entry, setEntry] = useState(state?.entry || null);
  const [loading, setLoading] = useState(!state?.entry);

  useEffect(() => {
    if (state?.entry || !user) return;
    getCheckIns(user.uid, 1)
      .then((entries) => setEntry(entries[0] || null))
      .finally(() => setLoading(false));
  }, [state?.entry, user]);

  if (loading) return <Loading message="Đang tải kết quả gần nhất…" />;
  if (!entry) {
    return (
      <main className="page"><div className="container empty-state">
        <span className="empty-icon">☼</span><h1>Chưa có kết quả nào</h1>
        <p>Hãy thực hiện check-in đầu tiên để Mind Guard có thể giúp bạn theo dõi những thay đổi nhỏ mỗi ngày.</p>
        <Link to="/checkin"><Button>Bắt đầu check-in</Button></Link>
      </div></main>
    );
  }

  const feedback = entry.feedback || {};
  const reasons = entry.explanation?.reasons || entry.detectedSignals?.map((signal) => signal.label) || [];
  return (
    <main className="page">
      <div className="container result-container">
        <div className="page-intro result-intro">
          <span className="eyebrow">KẾT QUẢ CHECK-IN</span>
          <h1>Cảm ơn bạn đã dành thời gian cho bản thân.</h1>
          <p>Đây là phản hồi để bạn quan sát hôm nay, không phải chẩn đoán sức khỏe.</p>
        </div>
        {entry.needsHumanFollowUp && (
          <section className="human-support-alert" role="alert">
            <div><strong>Điều bạn vừa chia sẻ rất quan trọng.</strong><p>Nếu bạn có thể làm hại bản thân hoặc không an toàn, hãy gọi 1900 1267 hoặc đến gần một người bạn tin cậy ngay bây giờ.</p></div>
            <Link to="/support"><Button>Nhận hỗ trợ ngay</Button></Link>
          </section>
        )}
        <div className="grid-3 result-stats">
          <ResultCard title="Tâm trạng" value={`${entry.mood}/10`} />
          <ResultCard title="Căng thẳng" value={`${entry.stress}/10`} />
          <ResultCard title="Cảm xúc nổi bật" value={entry.emotion || 'Chưa xác định'} />
        </div>
        <div className="result-grid">
          <RiskLevel level={entry.riskLevel} urgent={entry.needsHumanFollowUp} />
          <section className="panel feedback-panel">
            <p className="eyebrow">NHẬN XÉT NHẸ NHÀNG</p>
            <h2>{feedback.title || 'Kết quả đã được ghi nhận'}</h2>
            <p>{feedback.message || 'Check-in của bạn đã được lưu để theo dõi theo thời gian.'}</p>
          </section>
          <section className="panel">
            <h2>Điều hệ thống ghi nhận</h2>
            {reasons.length ? <ul className="reason-list">{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : <p className="muted">Các chỉ số hôm nay chưa có yếu tố nổi bật cần đưa vào giải thích.</p>}
          </section>
          <section className="panel">
            <h2>Bước nhỏ cho 24 giờ tới</h2>
            <ol className="action-list">{(feedback.actions || ['Quay lại check-in vào ngày mai']).map((action) => <li key={action}>{action}</li>)}</ol>
          </section>
        </div>
        <div className="result-actions">
          <Link to="/dashboard"><Button variant="secondary">Về tổng quan</Button></Link>
          <Link to="/history"><Button>Xem xu hướng của tôi</Button></Link>
        </div>
      </div>
    </main>
  );
}
