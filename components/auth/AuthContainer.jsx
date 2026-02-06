"use client";

// Client Component because using useState and onClick function

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./Auth.module.css";

export default function AuthContainer() {
	// State that controls whether the Register view is active
	// false = Login view
	// true  = Register view
	// it make it a bit animated for better UX/UI
	const [showRegister, setShowRegister] = useState(false);

	return (
		// Outer wrapper ideally will help to style page later
		<div className={styles.wrapper}>
			{/* Main container holding forms and overlay */}
			<div className={styles.container}>
				{/* 
					Static white forms
					These forms do NOT move.
					The overlay slides on top of them to create the animation.
				*/}
				<div className={styles.forms}>
					{/* Login form container */}
					<div className={styles.loginForm}>
						<LoginForm />
					</div>

					{/* Register form container */}
					<div className={styles.registerForm}>
						<RegisterForm />
					</div>
				</div>

				{/* 
					Moving overlay.
					This element slides left/right or top/bottom depending on showRegister state
				*/}
				<div
					className={`${styles.overlay} ${
						showRegister ? styles.overlayLeft : styles.overlayRight
					}`}
				>
					{/* If showRegister equals true
						user is on Register screen
						show "Welcome Back" message + Login button
					*/}
					{showRegister ? (
						<>
							<h2>Welcome Back!</h2>
							<p>Already have an account with us?</p>

							{/* Switch back to Login view */}
							<button
								className={styles.switchButton}
								onClick={() => setShowRegister(false)}
							>
								Login
							</button>
						</>
					) : (
						/* 
							If showRegister equals false
							user is on Login screen
							show "Hello" message and Register button
						*/
						<>
							<h2>Hello, Welcome!</h2>
							<p>Don't have an account with us?</p>

							{/* Switch to Register view */}
							<button
								className={styles.switchButton}
								onClick={() => setShowRegister(true)}
							>
								Register
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
