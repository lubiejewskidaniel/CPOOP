/*
The planned security of the application is based on the idea that data access 
should not be controlled on the frontend. The client-side code is only meant 
to connect the application with Firebase, while security rules are planned to be handled on the backend.
Firebase configuration values are planned to be stored in environment variables instead of 
being written directly in the code. This is intended to reduce the risk of exposing important data. 
The application is also planned to use a single Firebase instance to avoid technical issues.
Access to data is planned to depend on user authentication and assigned roles, so users can only access the data they are allowed to.
Also i Implemented gin code gurads as well as guard components like <SuperAdminRoute>
*/

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // authentication in Firebase
import { getFirestore } from "firebase/firestore"; // importing function to get access to Firebase Firestore

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Ensure a single Firebase app instance to prevent
// "Firebase App already exists" errors
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// instance of Firebase authentication
export const authenticationInstance = getAuth(app);
// instance of access to Firebase Firestore database
export const firestoreDatabase = getFirestore(app);
