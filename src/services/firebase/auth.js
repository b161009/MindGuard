import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./config";

// Đăng ký
export const register = async (email, password, displayName) => {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credentials.user, { displayName });
  }
  return credentials;
};

// Đăng nhập
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Đăng xuất
export const logout = async () => {
  return await signOut(auth);
};

export const observeAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const reauthenticateWithPassword = async (user, password) => {
  const credential = EmailAuthProvider.credential(user.email, password);
  return reauthenticateWithCredential(user, credential);
};

export const deleteAuthUser = async (user) => deleteUser(user);

export const requestPasswordReset = async (email) => sendPasswordResetEmail(auth, email);
