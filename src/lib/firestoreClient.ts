/**
 * Firestore client only — Auth moved to authApi / authSession (JWT).
 * Kept so messaging listeners in DashboardContext can use onSnapshot.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId || undefined,
});

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export { firebaseConfig };
