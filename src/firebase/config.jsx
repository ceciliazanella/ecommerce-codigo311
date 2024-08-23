import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFC_naBjyIoC4uOAw1E34hArymFFHnDVI",
  authDomain: "codigo311-ecommerce.firebaseapp.com",
  projectId: "codigo311-ecommerce",
  storageBucket: "codigo311-ecommerce.appspot.com",
  messagingSenderId: "1054380441621",
  appId: "1:1054380441621:web:c1e0a5181354ef93394e1c",
  measurementId: "G-FTQC8B1MNS",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
