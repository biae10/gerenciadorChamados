import {initializeApp} from "firebase/app"
import{getAuth} from "firebase/auth"

const firebaseConfig={
  apiKey: "AIzaSyAXiy6fYWaj6FkSNYVQ1nd-gEuXnPtCWy0",
  authDomain: "testefirebase1-87fba.firebaseapp.com",
  projectId: "testefirebase1-87fba",
  storageBucket: "testefirebase1-87fba.appspot.com",
  messagingSenderId: "433997112369",
  appId: "1:433997112369:web:8ae39425f5edf2e42fe110",
  measurementId: "G-345V6WJRPT"
}


const app=initializeApp(firebaseConfig);
var auth=null;
if(app){
    auth=getAuth();
}

export default auth;