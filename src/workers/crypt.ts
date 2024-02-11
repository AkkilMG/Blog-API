import * as CryptoJS from 'crypto-js';

require('dotenv').config();

export const encrypt = async (text: string) => {
  const ciphertext = CryptoJS.AES.encrypt(text, process.env.KEY).toString();
  return ciphertext.replace(/\//g, ':');
}

export const decrypt = async (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext.replace(':', '/'), process.env.KEY);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

export const passwordChecker = async (password: string) => {
  if (password.length < 12) {
    return { success: false, message: 'Password is too short. It should be at least 12 characters.' };
  }
  if (!/[a-z]/.test(password)) {
    return { success: false, message: 'Password should contain at least one lowercase letter.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { success: false, message: 'Password should contain at least one uppercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { success: false, message: 'Password should contain at least one number.' };
  }
  if (!/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]+/.test(password)) {
    return { success: false, message: 'Password should contain at least one special character.' };
  }
  return { success: true };
};