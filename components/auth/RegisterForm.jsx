"use client";

// This is a CLIENT component because I use useState (browser state) and I talk to Firebase Auth from the browser.
// This form creates a new account, based on wht user types and then click Register Firebase creates auth user and then I save extra user data in Firestore.

import { useState } from "react";

// Firebase Auth = creates the login account (email + password) + updates display name
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Firestore = my own "users" collection where I store extra informations
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { authenticationInstance, firestoreDatabase } from "@/lib/firebase";

import styles from "./Auth.module.css";

export default function RegisterForm() {
	// I keep input values in state so react can control the form
	const [emailAddress, setEmailAddress] = useState("");
	const [userPassword, setUserPassword] = useState("");
	const [username, setUsername] = useState("");

	// I keep an error message here, so I can show it under the inputs if something fails
	const [registrationErrorMessage, setRegistrationErrorMessage] = useState("");

	// Here similar to other components I can disable the button while registering
	const [isRegistrationInProgress, setIsRegistrationInProgress] =
		useState(false);

	// Main register flow happens here I mean runs when user clicks Register
	async function handleRegister(event) {
		// Prevent page refresh otherwiserReact state would reset
		event.preventDefault();

		// Clear old errors amd start loading
		setRegistrationErrorMessage("");
		setIsRegistrationInProgress(true);

		try {
			// Creating the account in Firebase Authentication this gives me a real UID
			const userCredential = await createUserWithEmailAndPassword(
				authenticationInstance,
				emailAddress,
				userPassword
			);

			// Firebase returns the new user object here
			const createdUser = userCredential.user;

			// Seting displayName in Firebase Auth so user has a name, not only email
			await updateProfile(createdUser, {
				displayName: username,
			});

			// Want to save extra profile data in Firestore in my own users collection
			// I do this because Firebase Auth doesn't store stuff like role or pharmacyId (unless i change it later)
			await setDoc(doc(firestoreDatabase, "users", createdUser.uid), {
				uid: createdUser.uid,
				email: createdUser.email,
				displayName: username,

				// Default role for a normal person, later admin can change it
				role: "USER",

				// not connected to any pharmacy at the start
				pharmacyId: null,

				// Firestore timestamp what is important it is a server time not user's computer time=)
				createdAt: serverTimestamp(),
			});

			// I could redirect or clear form, but right now I just finish as it is enough for assessment crteria I believe
		} catch (error) {
			// If anything fails (auth or firestore), I show quick message to the user
			setRegistrationErrorMessage(error.message);
		} finally {
			// Always stop loading of course
			setIsRegistrationInProgress(false);
		}
	}

	return (
		// onSubmit means pressing Enter also works not only clicking the button
		<form className={styles.form} onSubmit={handleRegister}>
			<h2>Register</h2>

			{/* Username input gonna be helpful I use this later as displayName */}
			<input
				className={styles.input}
				placeholder="Username"
				value={username}
				onChange={(event) => setUsername(event.target.value)}
				required
			/>

			{/* Email input for Firebase Auth */}
			<input
				className={styles.input}
				type="email"
				placeholder="Email"
				value={emailAddress}
				onChange={(event) => setEmailAddress(event.target.value)}
				required
			/>

			{/* Password input for Firebase Auth */}
			<input
				className={styles.input}
				type="password"
				placeholder="Password"
				value={userPassword}
				onChange={(event) => setUserPassword(event.target.value)}
				required
			/>

			{/* If registration faile will show error message */}
			{registrationErrorMessage && (
				<p style={{ color: "red" }}>{registrationErrorMessage}</p>
			)}

			{/* Button is disabled while registering so user of course is unable to do multi clicks - spam clicks */}
			<button className={styles.button} disabled={isRegistrationInProgress}>
				{isRegistrationInProgress ? "Creating..." : "Register"}
			</button>

			{/* Extra info for people who want a business/pharmacy admin account */}
			<p className={styles.businessInfo}>
				<strong>Are you registering a pharmacy business account?</strong>
				<br />
				Please complete the standard registration above and then contact us at{" "}
				<a href="mailto:lubiejewskidaniel@gmail.com">
					lubiejewskidaniel@gmail.com
				</a>{" "}
				to request access to the Business Portal.
			</p>
		</form>
	);
}
