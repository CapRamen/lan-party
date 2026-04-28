// ================================
// CONFIGURATION FIREBASE
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD517rD0UNLlg0AAywtotFTmnOSfoUQMh0",
  authDomain: "relan-2026.firebaseapp.com",
  projectId: "relan-2026",
  storageBucket: "relan-2026.firebasestorage.app",
  messagingSenderId: "665573121710",
  appId: "1:665573121710:web:6b2b8621beb432b82b573f"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================================
// FONCTIONS UTILITAIRES
// ================================

// Sauvegarder une donnée dans Firestore
async function fbSet(collection, docId, data) {
  try {
    await setDoc(doc(db, collection, docId), data);
  } catch (e) {
    console.error('Erreur Firebase set:', e);
  }
}

// Lire une donnée depuis Firestore
async function fbGet(collectionId, docId) {
  try {
    const snap = await getDoc(doc(db, collectionId, docId));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('Erreur Firebase get:', e);
    return null;
  }
}

// Écouter les changements en temps réel
function fbWatch(collectionId, docId, callback) {
  return onSnapshot(doc(db, collectionId, docId), function(snap) {
    if (snap.exists()) callback(snap.data());
  });
}

export { db, fbSet, fbGet, fbWatch };