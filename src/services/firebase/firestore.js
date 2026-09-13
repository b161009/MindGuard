import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

const checkInsRef = (userId) => collection(db, 'users', userId, 'checkins');

export const CONSENT_VERSION = '2026-09-14';

export async function saveUserProfile(user, displayName, consents = {}) {
  const ref = doc(db, 'users', user.uid);
  const profile = {
    email: user.email || '',
    displayName: displayName || user.displayName || '',
    updatedAt: serverTimestamp(),
  };

  if (consents.dataProcessing) {
    profile.dataProcessingConsent = {
      granted: true,
      version: CONSENT_VERSION,
      acceptedAt: serverTimestamp(),
    };
  }
  if (typeof consents.researchParticipation === 'boolean') {
    profile.researchConsent = {
      granted: consents.researchParticipation,
      version: CONSENT_VERSION,
      updatedAt: serverTimestamp(),
    };
  }
  await setDoc(ref, profile, { merge: true });
}

export async function getUserProfile(userId) {
  const snapshot = await getDoc(doc(db, 'users', userId));
  return snapshot.exists() ? snapshot.data() : null;
}

// One check-in per local calendar day. Saving again updates that day's entry.
export async function saveCheckIn(userId, payload) {
  const dateKey = payload.dateKey || new Date().toISOString().slice(0, 10);
  const ref = doc(db, 'users', userId, 'checkins', dateKey);
  const entry = {
    ...payload,
    userId,
    dateKey,
    updatedAt: serverTimestamp(),
    createdAt: payload.createdAt || serverTimestamp(),
  };

  await setDoc(ref, entry, { merge: true });
  return { id: dateKey, ...payload, userId, dateKey };
}

export async function getCheckIns(userId, maxEntries = 30) {
  const entriesQuery = query(
    checkInsRef(userId),
    orderBy('dateKey', 'desc'),
    limit(maxEntries),
  );
  const snapshot = await getDocs(entriesQuery);
  return snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
}

export async function updateResearchConsent(userId, granted) {
  await setDoc(doc(db, 'users', userId), {
    researchConsent: {
      granted: Boolean(granted),
      version: CONSENT_VERSION,
      updatedAt: serverTimestamp(),
    },
  }, { merge: true });
}

/**
 * Deletes the profile and every direct check-in for the current schema.
 * If nested subcollections are added later, move this work to a trusted
 * Cloud Function using Admin SDK recursiveDelete before enabling account removal.
 */
export async function deleteAllUserData(userId) {
  const checkInSnapshot = await getDocs(checkInsRef(userId));
  const refs = [...checkInSnapshot.docs.map((item) => item.ref), doc(db, 'users', userId)];
  const batchSize = 400;

  for (let index = 0; index < refs.length; index += batchSize) {
    const batch = writeBatch(db);
    refs.slice(index, index + batchSize).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}
