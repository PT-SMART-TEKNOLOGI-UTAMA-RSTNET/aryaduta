import "firebase/compat/app";
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
    apiKey: "AIzaSyB1kU8lkfKtqQL09aOsFYKfGoXjqcqbuME",
    authDomain: "aryaduta-14523.firebaseapp.com",
    projectId: "aryaduta-14523",
    storageBucket: "aryaduta-14523.appspot.com",
    messagingSenderId: "130822304748",
    appId: "1:130822304748:web:25bac4be64109693bb06c9",
    measurementId: "G-20BPW98B0J"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.setCustomParameters({prompt:'select_account'});
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const ui = new firebaseui.auth.AuthUI(auth);

export { auth, googleAuthProvider, facebookAuthProvider, ui };
