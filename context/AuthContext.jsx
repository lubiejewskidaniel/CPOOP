"use client";

/*
The AuthenticationContext and AuthenticationProvider are used to handle login 
and user information across the entire application. 
They keep track of whether a user is logged in, store the current Firebase user, 
and get extra details like the user’s role from Firestore. 
By using context, this information can be shared with any component without passing props around. 
They run on the client because Firebase Authentication works in the browser and they rely also on hooks.
*/

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { authenticationInstance, firestoreDatabase } from "@/lib/firebase";

const AuthenticationContext = createContext(null);

export function AuthenticationProvider({ children }) {
	// Stores Firebase authenticated user
	const [authenticatedUser, setAuthenticatedUser] = useState(null);

	// Stores user's role from Firestore
	const [userRole, setUserRole] = useState(null);

	// Loading state for Firebase Authentication
	const [isAuthenticationLoading, setIsAuthenticationLoading] = useState(true);

	// Loading state for Firestore user profile
	const [isUserProfileLoading, setIsUserProfileLoading] = useState(true);

	// Listen to authentication state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			authenticationInstance,
			async (firebaseUser) => {
				// Starts loading whenever auth state changes
				setIsAuthenticationLoading(true);
				setIsUserProfileLoading(true);

				// User logged out
				if (!firebaseUser) {
					setAuthenticatedUser(null);
					setUserRole(null);
					setIsAuthenticationLoading(false);
					setIsUserProfileLoading(false);
					return;
				}

				// User logged in
				setAuthenticatedUser(firebaseUser);

				try {
					// Gets user document from Firestore
					const userDocumentReference = doc(
						firestoreDatabase,
						"users",
						firebaseUser.uid,
					);

					const userDocumentSnapshot = await getDoc(userDocumentReference);

					// If user profile exists, gets role
					if (userDocumentSnapshot.exists()) {
						const userData = userDocumentSnapshot.data();
						setUserRole(userData.role);
					} else {
						// Fallback role if document is missing
						setUserRole("USER");
					}
				} catch (error) {
					// Error handling in case
					setUserRole("USER");
				} finally {
					// Stop loading states
					setIsAuthenticationLoading(false);
					setIsUserProfileLoading(false);
				}
			},
		);
		// Cleanup Firebase auth listener on unmount
		return () => unsubscribe();
	}, []);

	return (
		<AuthenticationContext.Provider
			value={{
				authenticatedUser,
				userRole,
				isAuthenticationLoading,
				isUserProfileLoading,
			}}
		>
			{children}
		</AuthenticationContext.Provider>
	);
}

// My custom hook for accessing authentication context
export function useAuthentication() {
	return useContext(AuthenticationContext);
}
