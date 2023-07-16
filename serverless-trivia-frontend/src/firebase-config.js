import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmj8EazZwuJHAG68fO5SiguRyUOTptNUg",
  authDomain: "integral-server-387216.firebaseapp.com",
  projectId: "integral-server-387216",
  storageBucket: "integral-server-387216.appspot.com",
  messagingSenderId: "1048439879359",
  appId: "1:1048439879359:web:b67e890e99f57580adf80a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {})
    .catch((error) => console.log(error));
};
