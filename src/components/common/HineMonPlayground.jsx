import { useState } from 'react';

// Each surprise has its own reveal sequence; progress stays in this visit only.
const surprises = [
  { title: 'Thư gấp tư', icon: '💌', action: 'Mở một nếp thư', steps: ['Một lá thư bé xíu đang đợi em.', 'Gửi HineMon,', 'Có một người vừa nghĩ đến em và mỉm cười.', 'Người đó là anh. Anh yêu em💋💐'] },
  { title: 'Vườn của em', icon: '🌱', action: 'Tưới một chút', steps: ['🌱 Một hạt mầm nhỏ.', '🌱 💧 Mầm cây đã uống nước rồi!', '🌿 Lá non chào em nè.', '🌷 Bông hoa đầu tiên dành cho em.', '🌷 🌸 🌼 Cả khu vườn nở vì em ghé thăm.'] },
  { title: 'Bầu trời riêng', icon: '⭐', action: 'Thắp một ngôi sao', steps: ['🌌 Trời đang đợi em bật đèn.', '⭐ Một ngôi sao cho nụ cười của em.', '⭐ ✨ Thêm một ngôi sao cho những cố gắng nhỏ.', '⭐ ✨ 🌟 Ba ngôi sao, một điều ước: em có một ngày dịu dàng.'] },
  { title: 'Mèo làm quen', icon: '🐱', action: 'Gãi cằm bé mèo', steps: ['🐱 Meo? Ai đáng yêu vừa tới vậy?', '😺 Bé mèo tiến lại gần.', '😽 Rừ rừ… bé cho em vuốt đầu rồi.', '🐈 💗 Bé mèo quyết định nằm cạnh em.'] },
  { title: 'Trà sữa ảo', icon: '🧋', action: 'Thêm nguyên liệu', steps: ['🥛 Một chiếc ly đang trống.', '🍵 Thêm trà thơm.', '🥛 Thêm sữa dịu ngọt.', '🧋 Thêm trân châu. Ly đặc biệt cho HineMon xong rồi!'] },
  { title: 'Bánh may mắn', icon: '🥠', action: 'Bẻ bánh', steps: ['🥠 Có một mẩu giấy bên trong.', '🥠 “Em không cần hoàn hảo để được yêu thương.”'] },
  { title: 'Chuyến đi nhỏ', icon: '🚀', action: 'Bay thêm một chặng', steps: ['🚀 Phi hành đoàn HineMon sẵn sàng!', '☁️ Đã bay qua một đám mây mềm.', '🌙 Ghé Mặt Trăng nhặt một chút ánh sáng.', '🪐 Đến hành tinh màu hồng. Cư dân ở đây đều quý em.'] },
  { title: 'Hũ lời khen', icon: '🫙', action: 'Rút một mẩu giấy', steps: ['🫙 Một chiếc hũ đầy điều dễ thương.', 'Em có cách làm những chuyện nhỏ trở nên đáng nhớ.', 'Anh thích em khi cười, và cũng thương em những lúc im lặng.', 'Hôm nay em được phép tự hào về chính mình.'] },
  { title: 'Chăn mây', icon: '☁️', action: 'Kéo chăn lên', steps: ['☁️ Có một chiếc chăn làm bằng mây.', '🛋️ Một góc ngồi thật êm.', '🧸 Thêm một bạn gấu bên cạnh.', '🌙 Ấm rồi nha. Em cứ nghỉ một chút nếu muốn.'] },
  { title: 'Cầu vồng', icon: '🌈', action: 'Gọi thêm một màu', steps: ['🌦️ Một cơn mưa vừa đi qua.', '❤️ 🧡 Hai vệt màu đầu tiên.', '❤️ 🧡 💛 💚 Bầu trời đang sáng hơn.', '🌈 Đủ màu rồi! Gửi em cả một cầu vồng.'] },
  { title: 'Bưu thiếp biển', icon: '🐚', action: 'Lật bưu thiếp', steps: ['🏖️ Mặt trước: biển xanh và một chiếc vỏ sò.', '💌 Mặt sau: “Ước gì được cùng em đi dạo ở đây.”'] },
  { title: 'Chọn một cửa', icon: '🚪', choices: ['🌷 Cửa hoa', '🌙 Cửa trăng', '🍓 Cửa dâu'], answers: ['💐 Sau cửa là một bó hoa và cái ôm.', '✨ Sau cửa là bầu trời sao dành riêng cho em.', '🍰 Sau cửa là một chiếc bánh dâu nhỏ xinh.'] },
  { title: 'Bắt trái tim', icon: '💘', action: 'Bắt tim', steps: ['💗 Bắt đủ ba trái tim nhé!', '💗 🤍 🤍 Bắt được một rồi!', '💗 💗 🤍 Còn một trái tim nữa.', '💗 💗 💗 Đủ rồi! Phần thưởng là một cái ôm từ anh.'] },
  { title: 'Nến điều ước', icon: '🕯️', action: 'Thổi nến', steps: ['🕯️ Nghĩ một điều ước trong lòng, rồi bấm thổi nến nhé.', '✨ Nến đã tắt. Điều ước của em vẫn là bí mật của em.'] },
  { title: 'Mật mã tình yêu', icon: '🔐', action: 'Giải một ký tự', steps: ['🔐 Mật mã: A • Y • E', 'A = Anh', 'A • Y = Anh yêu', 'A • Y • E = Anh yêu em💋💐'] },
];

export default function HineMonPlayground() {
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState({});
  const [discovered, setDiscovered] = useState([]);
  const item = selected === null ? null : surprises[selected];
  const step = progress[selected] ?? 0;
  const discover = () => setDiscovered((current) => current.includes(selected) ? current : [...current, selected]);
  const advance = () => {
    const next = Math.min(step + 1, item.steps.length - 1);
    setProgress((current) => ({ ...current, [selected]: next }));
    if (next === item.steps.length - 1) discover();
  };

  return <details className="hinemon-playground">
    <summary>🗝️ 15 bí mật nhỏ · {discovered.length}/15</summary>
    <div className="hinemon-menu" aria-label="Chọn một bất ngờ">
      {surprises.map((surprise, index) => <button key={surprise.title} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <span aria-hidden="true">{surprise.icon}</span>{surprise.title}{discovered.includes(index) && <span className="hinemon-found" aria-label="Đã khám phá"> ✓</span>}
      </button>)}
    </div>
    {item && <section className="hinemon-mini" aria-label={item.title}>
      <h3>{item.icon} {item.title}</h3>
      <p role="status">{item.steps ? item.steps[step] : progress[selected] === undefined ? 'Cửa nào cũng có một chút yêu thương. Em chọn nhé!' : item.answers[step]}</p>
      <div className="hinemon-actions">
        {item.choices ? item.choices.map((choice, index) => <button type="button" key={choice} onClick={() => { setProgress((current) => ({ ...current, [selected]: index })); discover(); }}>{choice}</button>) :
          step < item.steps.length - 1 ? <button type="button" onClick={advance}>{item.action}</button> :
            <button type="button" onClick={() => setProgress((current) => ({ ...current, [selected]: 0 }))}>Chơi lại ↻</button>}
      </div>
    </section>}
    {discovered.length === surprises.length && <p role="status">👑 HineMon đã khám phá hết rồi! Tặng em danh hiệu: người được thương nhất góc nhỏ này 💕</p>}
  </details>;
}
