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
messaging.requestPermission()
.then(function() {
  console.log('Have permission firebase');
  return messaging.getToken();
})
.then(function(token) {
  // should send to server, then can use the fcm api with this token
  console.log("Firebase token:", token);
})
.catch(function(err) {
  console.log('Error occurred');
  console.error(err);
});

messaging.onMessage(function(payload) {
  console.log('onMessage: ', payload);
  var notification = new Notification(payload.notification.title, { body: payload.notification.body, icon: payload.notification.icon });
});
