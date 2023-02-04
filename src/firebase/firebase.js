// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCbC1bTIbpFsZJRtPWvetywpsnO5hIfwS0",
    authDomain: "mytest-585af.firebaseapp.com",
    projectId: "mytest-585af",
    storageBucket: "mytest-585af.appspot.com",
    messagingSenderId: "633605322194",
    appId: "1:633605322194:web:63344a64ab9b67db1c440b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);