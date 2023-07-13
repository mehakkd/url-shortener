import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAqQtVCHRE4DNHAEINhV4Ih2TDlXhbvdEM",
  authDomain: "url-shortener-e670f.firebaseapp.com",
  projectId: "url-shortener-e670f",
  storageBucket: "url-shortener-e670f.appspot.com",
  messagingSenderId: "1057516573680",
  appId: "1:1057516573680:web:1afae67530e7ef766fc335",
  measurementId: "G-1161QRWG22"
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
