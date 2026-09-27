import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useAuth } from '../../hooks/useAuth';

export default function HineMonSurprise() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const dialog = useRef(null);
  const name = profile?.uid === user?.uid ? profile.name : user?.displayName;
  const active = Boolean(user && name?.trim().toLowerCase() === 'hinemon');
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
    <dialog ref={dialog} className="hinemon-dialog" aria-labelledby="hinemon-message"
      onCancel={() => setDismissed(true)}
      onClick={(event) => { if (event.target === event.currentTarget) setDismissed(true); }}>
      <div className="hinemon-message">
        <button className="hinemon-close" type="button" onClick={() => setDismissed(true)} aria-label="Đóng lời nhắn">×</button>
        <span className="hinemon-heart" aria-hidden="true">♥</span>
        <h2 id="hinemon-message">Anh yêu em💋💐</h2>
        <p>Chạm bên ngoài để đóng</p>
      </div>
    </dialog>
  );
}
