var config = {
  apiKey: "",
  authDomain: "post-school-access-map.firebaseapp.com",
  databaseURL: "https://post-school-access-map.firebaseio.com",
  projectId: "post-school-access-map",
  storageBucket: "post-school-access-map.appspot.com",
  messagingSenderId: ""
};

firebase.initializeApp(config);

const FORUM  = firebase.database().ref("FORUM/Messages");
const PSAM = firebase.database().ref("PSAM");