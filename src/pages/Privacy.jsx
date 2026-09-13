import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <main className="page"><article className="container privacy-page">
      <span className="eyebrow">THÔNG BÁO DỮ LIỆU · PHIÊN BẢN 2026-09-14</span>
      <h1>Minh bạch về dữ liệu của bạn</h1>
      <p className="privacy-lead">Mind Guard giúp bạn tự theo dõi; không chẩn đoán, không thay thế nhà chuyên môn và không phải dịch vụ khẩn cấp.</p>
      <section><h2>Chúng tôi lưu gì?</h2><p>Tên hiển thị, email, câu trả lời check-in, phần chia sẻ tự nguyện, các kết quả phân tích như cảm xúc/tín hiệu/mức cần chú ý và phản hồi. Dữ liệu lưu trong Firebase theo tài khoản của bạn.</p></section>
      <section><h2>Dùng vào việc gì?</h2><p>Dữ liệu cốt lõi chỉ dùng để hiển thị lịch sử, phân tích xu hướng và phản hồi trong Mind Guard. Kết quả không phải kết luận y khoa.</p></section>
      <section><h2>Nghiên cứu là lựa chọn riêng</h2><p>Việc dùng dữ liệu cho nghiên cứu NLP là hoàn toàn tự nguyện, tách khỏi sự đồng ý sử dụng ứng dụng. Không đồng ý hoặc rút đồng ý sẽ không làm mất quyền dùng app. Chỉ chuẩn bị dữ liệu đã khử định danh sau khi có quy trình nghiên cứu được người phụ trách phê duyệt.</p></section>
      <section><h2>Quyền kiểm soát</h2><p>Bạn có thể thay đổi lựa chọn nghiên cứu tại Hồ sơ. Bạn cũng có thể xoá tài khoản; thao tác này xoá hồ sơ và check-in đang lưu trong Firestore. Nhóm dự án cần công bố chính sách lưu bản sao lưu/log riêng trước khi phát hành dữ liệu thật.</p></section>
      <section><h2>Khi nào cần con người?</h2><p>Nếu bạn thấy mình không an toàn, hãy liên hệ dịch vụ khẩn cấp tại nơi bạn ở hoặc một người bạn tin cậy. Mind Guard không tự đưa ra quyết định can thiệp.</p></section>
      <Link className="inline-link" to="/register">Quay lại đăng ký</Link>
    </article></main>
  );
}
