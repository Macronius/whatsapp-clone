import firebase from 'firebase';

// console.log(firebase);

const firebaseConfig = {
  apiKey: 'AIzaSyCd-LlRwkiT5ZhsD5BgEUDAnCVPW8HUODA',
  authDomain: 'whatsapp-clone-ea97a.firebaseapp.com',
  projectId: 'whatsapp-clone-ea97a',
  storageBucket: 'whatsapp-clone-ea97a.appspot.com',
  messagingSenderId: '256119872316',
  appId: '1:256119872316:web:114eac4d994a0defaf5c39',
};

// Initialize Firebase
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
