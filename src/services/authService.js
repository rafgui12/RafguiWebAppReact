import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,        
  updateEmail,         
  sendPasswordResetEmail ,
  sendEmailVerification
} from "firebase/auth";
import { auth } from '../firebaseConfig'; 

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// --- NUEVAS FUNCIONES DE PERFIL ---

/**
 * Actualiza el 'displayName' y 'photoURL' del usuario.
 * @param {object} profileData - { displayName, photoURL }
 */
export const updateUserProfile = (profileData) => {
  if (!auth.currentUser) return Promise.reject(new Error("No user logged in"));
  return updateProfile(auth.currentUser, profileData);
};

/**
 * Actualiza el email del usuario.
 * (Requiere re-autenticación reciente)
 * @param {string} newEmail
 */
export const updateUserEmail = (newEmail) => {
  if (!auth.currentUser) return Promise.reject(new Error("No user logged in"));
  return updateEmail(auth.currentUser, newEmail);
};

/**
 * Actualiza la contraseña del usuario.
 * (Requiere re-autenticación reciente)
 * @param {string} newPassword
 */
export const updateUserPassword = (newPassword) => {
  if (!auth.currentUser) return Promise.reject(new Error("No user logged in"));
  return updatePassword(auth.currentUser, newPassword);
};

/**
 * Envía el email de verificación al usuario actual.
 */
export const sendVerificationEmail = () => {
  if (!auth.currentUser) return Promise.reject(new Error("No user logged in"));
  return sendEmailVerification(auth.currentUser); 
};

/**
 * Envía un email de reestablecimiento de contraseña.
 */
export const sendResetPasswordEmail = () => {
  if (!auth.currentUser) return Promise.reject(new Error("No user logged in"));
  return sendPasswordResetEmail(auth, auth.currentUser.email);
};

export const sendPublicPasswordResetEmail = (email) => {
  return sendPasswordResetEmail(auth, email);
};