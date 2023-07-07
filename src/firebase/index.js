import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const config = {
  apiKey: "AIzaSyDSQ3ZLUQLmTaIzHeYi9VZ7Kqq0VD1jK3c",
  authDomain: "gerak-lurus-6cf0c.firebaseapp.com",
  projectId: "gerak-lurus-6cf0c",
  storageBucket: "gerak-lurus-6cf0c.appspot.com",
  messagingSenderId: "588450702701",
  appId: "1:588450702701:web:05d384bf2554c36fe46664"
};


const firebaseApp = initializeApp(config)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe()
            resolve(user)
        }, 
        reject
      )
  })
}

export { firebaseApp, auth, db, storage, getCurrentUser }