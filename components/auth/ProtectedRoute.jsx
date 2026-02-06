"use client";
// This has to be a client component because:
// - I use useEffect (runs in the browser)
// - I use next/navigation router (redirects in the browser)
// - I read auth state from my AuthContext (client state)

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/context/AuthContext";

// ProtectedRoute here is a like a small gate component.
// I wrap pages components with it when I want only logged-in users to see them.
// Firebase/AuthContext is loading then showing "Checking..."
// If loading finished and user is NOT logged in I would like to redirect to /login
// If user IS logged in I want to show the page - children
export default function ProtectedRoute({ children }) {
	// I get auth info from context so I know who is logged in (authenticatedUser)
	// if Firebase is still figuring it out (isAuthenticationLoading)
	const { authenticatedUser, isAuthenticationLoading } = useAuthentication();

	// I using nextjs router for changing pages
	const router = useRouter();

	useEffect(() => {
		// I don't redirect immediately because at first Firebase might still be loading.
		// So I wait until isAuthenticationLoading is false and when loading is done AND there is no user I kick them to /logi n route.
		if (!isAuthenticationLoading && !authenticatedUser) {
			// replace() so they can't go "Back" to the protected page
			router.replace("/loginOrRegister");
		}
	}, [authenticatedUser, isAuthenticationLoading, router]);

	// While Firebase is still checking the session, I show a simple message.
	if (isAuthenticationLoading) {
		return <p>Checking authentication...</p>;
	}

	// If there is no user, I return null because the redirect will happen.
	// (So the protected content never renders for a logged-out person.)
	if (!authenticatedUser) {
		return null;
	}

	// If got here, user is logged in and render whatever was wrapped inside.
	return children;
}
