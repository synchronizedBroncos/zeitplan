importScripts('https://www.gstatic.com/firebasejs/5.5.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.9/firebase-messaging.js');

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCYsihge4e9SO4rZS7DpSRgWN5NXkuBcIs",
  authDomain: "zeitplan-db277.firebaseapp.com",
  databaseURL: "https://zeitplan-db277.firebaseio.com",
  projectId: "zeitplan-db277",
  storageBucket: "zeitplan-db277.appspot.com",
  messagingSenderId: "1033109428637"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
