import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCc2BHnL7JKAi8N9HSjsWYV35e3YtWTjxU",
  authDomain: "baneen-2f47c.firebaseapp.com",
  projectId: "baneen-2f47c",
  storageBucket: "baneen-2f47c.firebasestorage.app",
  messagingSenderId: "955214840494",
  appId: "1:955214840494:web:9c41429a87943cb7ae633f"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.style.visibility = "visible";
  } else {
    window.location.href = "index.html";
  }
});
