"use client";

// Another client side compnent as also using useState
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authenticationInstance } from "@/lib/firebase";
import styles from "./Auth.module.css";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	// I keep what user types here email and  password
	const [typedEmail, setTypedEmail] = useState("");
	const [typedPassword, setTypedPassword] = useState("");

	// Message for user when something goes wrong
	const [loginProblemNote, setLoginProblemNote] = useState("");

	// Whiile logging in I disable inputs and buttons
	const [isLoginInProgress, setIsLoginInProgress] = useState(false);

	const router = useRouter();

	async function handleLoginSubmit(event) {
		event.preventDefault();

		// reset old message before trying again
		setLoginProblemNote("");
		setIsLoginInProgress(true);

		try {
			// Firebase sign-in - email + password
			await signInWithEmailAndPassword(
				authenticationInstance,
				typedEmail,
				typedPassword
			);

			// If login works, go to homepage
			router.push("/");
		} catch (loginError) {
			// friendly error messages
			if (loginError?.code === "auth/invalid-credential") {
				setLoginProblemNote("Incorrect email or password. Please try again!");
			} else {
				setLoginProblemNote("Login failed. Please try again.");
			}
		} finally {
			// stop loading no matter what again
			setIsLoginInProgress(false);
		}
	}

	return (
		<form className={styles.form} onSubmit={handleLoginSubmit}>
			<h2>Login</h2>

			<input
				className={styles.input}
				type="email"
				placeholder="Email"
				value={typedEmail}
				onChange={(changeEvent) => setTypedEmail(changeEvent.target.value)}
				required
				disabled={isLoginInProgress}
			/>

			<input
				className={styles.input}
				type="password"
				placeholder="Password"
				value={typedPassword}
				onChange={(changeEvent) => setTypedPassword(changeEvent.target.value)}
				required
				disabled={isLoginInProgress}
			/>

			{loginProblemNote && <p style={{ color: "red" }}>{loginProblemNote}</p>}

			<button
				type="submit"
				className={styles.button}
				disabled={isLoginInProgress}
			>
				{isLoginInProgress ? "Logging in..." : "Login"}
			</button>

			<p className={styles.helpInfo}>
				<strong>Forgot your password?</strong>
				<br />
				Please contact us at{" "}
				<a href="mailto:lubiejewskidaniel@gmail.com">
					lubiejewskidaniel@gmail.com
				</a>{" "}
				for assistance.
			</p>
		</form>
	);
}
