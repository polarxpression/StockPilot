import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "./config";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
