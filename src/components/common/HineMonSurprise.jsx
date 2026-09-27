import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../hooks/useAuth';
import HineMonPlayground from './HineMonPlayground';
import { copyVariant } from '../../utils/copyVariant';

const notes = [
  'Hôm nay có thể bình thường, nhưng em thì luôn đặc biệt với anh 🌷',
  'Gửi em một cái ôm thật lâu. Không cần lý do đâu 🫂',
  'Nhớ uống nước nha, bông hoa nhỏ của anh 💧🌸',
  'Hôm nay em đã cố gắng rồi. Nghỉ một chút cũng được mà ☁️',
  'Nếu ngày hôm nay hơi xám, anh gửi em một chút màu hồng 🎀',
  'Không cần lúc nào cũng vui. Anh vẫn thương em như vậy 💗',
  'Một bó hoa không dịp gì cả, chỉ vì là em 💐',
  'Em không cần phải hết buồn ngay đâu. Anh gửi em một cái ôm, nếu em muốn 🫂',
  'Một lời trách không định nghĩa con người em. Em vẫn xứng đáng được đối xử dịu dàng 🌷',
  'Nếu thấy tủi thân, em cứ cho mình một khoảng nghỉ nhé. Chưa muốn kể cũng không sao ☁️',
  'Em không phải làm anh vui lúc này. Cứ chăm sóc cảm giác của em trước nha 💗',
  'Uống một ngụm nước, ngồi ở chỗ dễ chịu một chút. Từng việc nhỏ thôi cũng được 💧',
  'Khi sẵn sàng, em có thể nhắn anh hoặc một người em tin cậy. Em được quyền tìm sự lắng nghe 💌',
  'Mình chưa cần giải quyết hết mọi chuyện hôm nay. Anh thương em cả những lúc em buồn 💐',
];
const gifts = [
  ['💐', 'Một bó hoa dành riêng cho em.'],
  ['🧸', 'Một bạn gấu nhỏ, ôm thay anh một chút nhé.'],
  ['🍓', 'Một chút ngọt ngào cho ngày của em.'],
  ['🌙', 'Một lời chúc ngủ ngon, để dành cho tối nay.'],
  ['💌', 'Trong thư chỉ có một câu: Anh yêu em💋💐'],
];

export default function HineMonSurprise() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [noteIndex, setNoteIndex] = useState(() => {
    const today = new Date();
    return Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000) % notes.length;
  });
  const [giftIndex, setGiftIndex] = useState(-1);
  const [hearts, setHearts] = useState(0);
  const dialog = useRef(null);
  const name = user && profile?.uid === user.uid ? profile?.name : user?.displayName;
  const active = Boolean(user && typeof name === 'string' && name.trim().toLowerCase() === 'hinemon');
  const open = active && !dismissed;

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      setProfile({ uid: user.uid, name: snapshot.data()?.displayName ?? user.displayName });
    }, () => setProfile({ uid: user.uid, name: user.displayName }));
  }, [user]);

  useLayoutEffect(() => {
    if (active) document.documentElement.dataset.accent = 'rose';
    else delete document.documentElement.dataset.accent;
    return () => { delete document.documentElement.dataset.accent; };
  }, [active]);

  useEffect(() => { setDismissed(false); }, [active, user?.uid]);

  useEffect(() => {
    if (!active) return;
    const brand = document.querySelector('.brand');
    const reveal = () => setDismissed(false);
    brand?.addEventListener('dblclick', reveal);
    return () => brand?.removeEventListener('dblclick', reveal);
  }, [active]);

  useEffect(() => {
    setGiftIndex(-1);
    setHearts(0);
  }, [active, user?.uid]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const element = dialog.current;
    element.showModal();
    return () => {
      element.close();
      previousFocus?.focus?.();
    };
  }, [open]);

  return (
    <>
    {active && <button className="hinemon-gift-button" type="button" onClick={() => setDismissed(false)} aria-label="Mở quà nhỏ dành cho HineMon" title="Một bí mật dành cho HineMon">💌 <span>Quà nhỏ cho em</span></button>}
    <dialog ref={dialog} className="hinemon-dialog" aria-labelledby="hinemon-message"
      onCancel={() => setDismissed(true)}
      onClick={(event) => { if (event.target === event.currentTarget) setDismissed(true); }}>
      <div className="hinemon-message">
        <button className="hinemon-close" type="button" onClick={() => setDismissed(true)} aria-label="Đóng lời nhắn">×</button>
        <button className="hinemon-heart" type="button" onClick={() => setHearts((count) => count + 1)} aria-label="Nhận thêm một trái tim">♥</button>
        {open && hearts > 0 && <div key={hearts} className="hinemon-confetti" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <span key={index} style={{ '--i': index }}>{index % 2 ? '🌸' : '💗'}</span>)}</div>}
        <h2 id="hinemon-message">Anh yêu em💋💐</h2>
        <p>Em không cần gồng lên ở đây. Buồn một chút cũng được, chưa muốn nói cũng được.</p>
        <p className="hinemon-note" aria-live="polite">{notes[noteIndex]}</p>
        <div className="hinemon-actions">
          <button type="button" onClick={() => setNoteIndex((index) => (index + 1) % notes.length)}>💬 Thêm lời nhắn</button>
          <button type="button" onClick={() => setGiftIndex((index) => (index + 1) % gifts.length)}>🎁 Mở quà bí mật</button>
        </div>
        {giftIndex >= 0 && <div className="hinemon-gift" role="status"><span aria-hidden="true">{gifts[giftIndex][0]}</span><p>{gifts[giftIndex][1]}</p></div>}
        {hearts > 0 && <p role="status">{hearts >= 5 ? copyVariant('Bắt được rồi nha, em cũng thương anh đúng không? 🤭💕', 'Gửi em thêm một chút ấm áp. Em không cần đáp lại gì đâu 🫂💕') : `Gửi em ${hearts} trái tim nhỏ 💗`}</p>}
        {active && <HineMonPlayground key={user.uid} />}
        <p className="hinemon-hint">Chạm trái tim thử nha · Nhấn đúp logo để mở lại</p>
        <p>Chạm bên ngoài để đóng</p>
      </div>
    </dialog>
    </>
  );
}
