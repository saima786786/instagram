import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDcpqYjhLGQLjQYvajPGWQZqyH1oUiMl3Y",
    authDomain: "instagram-b13e3.firebaseapp.com",
    databaseURL: "https://instagram-b13e3.firebaseio.com",
    projectId: "instagram-b13e3",
    storageBucket: "instagram-b13e3.appspot.com",
    messagingSenderId: "585205960124",
    appId: "1:585205960124:web:2506c3e348757eec3b2fb9",
    measurementId: "G-XH2T1BQR23"
  });

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage };