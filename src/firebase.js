import firebase from 'firebase';

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyDych6lb1xLore2-c79bhuRabuQqMawlj0",
    authDomain: "instagram-clone-5b047.firebaseapp.com",
    databaseURL: "https://instagram-clone-5b047-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-5b047",
    storageBucket: "instagram-clone-5b047.appspot.com",
    messagingSenderId: "399922882341",
    appId: "1:399922882341:web:0b41174e73c3ff2ac6dccc",
    measurementId: "G-SFQBZD8K8R"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage}