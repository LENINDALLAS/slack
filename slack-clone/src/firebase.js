import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDThzvSSZjXq9KSXMHk38QM4U5TQvgWXXM",
    authDomain: "slack-clone-b9354.firebaseapp.com",
    projectId: "slack-clone-b9354",
    storageBucket: "slack-clone-b9354.appspot.com",
    messagingSenderId: "104336615812",
    appId: "1:104336615812:web:fcdafff7be7f6090f995d1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, provider };


