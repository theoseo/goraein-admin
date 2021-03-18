import firebase from 'firebase';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJsFJhQhWCijL3ckRs6KnyMBMPdPmUMls",
  authDomain: "goraein-fe21c.firebaseapp.com",
  projectId: "goraein-fe21c",
  storageBucket: "goraein-fe21c.appspot.com",
  messagingSenderId: "540478277026",
  appId: "1:540478277026:web:740f39e646e3341ff49efb",
  measurementId: "G-J867SEHD7K"
};try {
  firebase.initializeApp(firebaseConfig);
} catch(err){
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)}
}
const fire = firebase;
export default fire;
