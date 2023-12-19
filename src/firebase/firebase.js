// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {

}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);