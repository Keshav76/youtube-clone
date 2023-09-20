import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAlZkLicE4v6tVwA4RHytqoqizF7badyHw",
  authDomain: "fir-99b42.firebaseapp.com",
  projectId: "fir-99b42",
  storageBucket: "fir-99b42.appspot.com",
  messagingSenderId: "506922140618",
  appId: "1:506922140618:web:0dbb8d43541d0632e28533"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
export const provider = new GoogleAuthProvider();