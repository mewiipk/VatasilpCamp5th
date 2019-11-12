import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDvycFaj_L3lWoOE3PKWJ4eFX-zh2mzYw8",
    authDomain: "vatasilpcamp5th.firebaseapp.com",
    databaseURL: "https://vatasilpcamp5th.firebaseio.com",
    projectId: "vatasilpcamp5th",
    storageBucket: "vatasilpcamp5th.appspot.com",
    messagingSenderId: "88491023670",
    appId: "1:88491023670:web:7db115dd9aeb044e33e797"
  };

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();

export default firebase;