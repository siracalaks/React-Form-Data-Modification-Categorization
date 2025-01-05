import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const firebaseConfig = {
  // Firebase config buraya gelecek
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export class AuthService {
  static async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Kullanıcı dokümanı oluştur
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString(),
      });

      return userCredential.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getUserData(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static handleError(error) {
    let message = 'Bir hata oluştu';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Bu e-posta adresi zaten kullanımda';
        break;
      case 'auth/invalid-email':
        message = 'Geçersiz e-posta adresi';
        break;
      case 'auth/operation-not-allowed':
        message = 'E-posta/şifre girişi etkin değil';
        break;
      case 'auth/weak-password':
        message = 'Şifre çok zayıf';
        break;
      case 'auth/user-disabled':
        message = 'Kullanıcı hesabı devre dışı';
        break;
      case 'auth/user-not-found':
        message = 'Kullanıcı bulunamadı';
        break;
      case 'auth/wrong-password':
        message = 'Hatalı şifre';
        break;
      default:
        message = error.message;
    }

    return new Error(message);
  }

  // Veri şifreleme ve çözme metodları
  static encryptData(data, secretKey) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  }

  static decryptData(encryptedData, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // Kullanıcı verilerini şifreleyerek kaydetme
  static async saveEncryptedUserData(userId, data) {
    const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
    const encryptedData = this.encryptData(data, secretKey);

    await setDoc(doc(db, 'encrypted_data', userId), {
      data: encryptedData,
      updatedAt: new Date().toISOString(),
    });
  }

  // Şifrelenmiş kullanıcı verilerini çözme ve getirme
  static async getEncryptedUserData(userId) {
    try {
      const docRef = doc(db, 'encrypted_data', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
      const encryptedData = docSnap.data().data;
      return this.decryptData(encryptedData, secretKey);
    } catch (error) {
      throw this.handleError(error);
    }
  }
} 