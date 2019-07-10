import * as firebase from 'firebase'
export var config = {
    apiKey: "AIzaSyCPPdEr5m0CzHTRdzNmYW6LlkcTJxMUz6Y",
    authDomain: "servidor001-9280a.firebaseapp.com",
    databaseURL: "https://servidor001-9280a.firebaseio.com/",
    projectId: "servidor001-9280a",
    storageBucket: "servidor001-9280a.appspot.com",
  };

  firebase.initializeApp(config);

  export const ref = firebase.database().ref();
  export const firebaseAuth = firebase.auth();
