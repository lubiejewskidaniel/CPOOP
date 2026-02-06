"use client";

// This is again client component reads auth state from my AuthContext -client state.
// I use it like a "gate" around super admin route pages:
// if user is NOT logged in / NOT super admin - i show a message
// if user is super admin I render the real page  -children in this case

import { useAuthentication } from "@/context/AuthContext";

export default function SuperAdminRoute({ children }) {
	// I grab auth info from context, signedInUse -  who is logged in or null, signedInUserRole - role string lik
	//  "USER" / "PHARMACY_ADMIN" / "SUPER_ADMIN"
	// isAuthStillLoading - true while Firebase/AuthContext is still checking session
	const {
		authenticatedUser: signedInUser,
		userRole: signedInUserRole,
		isAuthenticationLoading: isAuthStillLoading,
	} = useAuthentication();

	// Important:
	// at the start signedInUser can be null just because Firebase is still loading.
	// So I wait first, otherwise I'd block people for a split second by mistake.
	if (isAuthStillLoading) return <p>Checking access...</p>;

	// My simple rule for super admin pages is: user must exist (logged in) and the role must be SUPER_ADMIN
	// I use !!signedInUser to convert user object or null into true or false false.
	const hasSuperAdminAccess =
		!!signedInUser && signedInUserRole === "SUPER_ADMIN";

	// If the rule fails, I don't redirect.
	// I show message so the user knows why they can't see the page ad what to do to have access.
	if (!hasSuperAdminAccess) {
		return (
			<h2 style={{ textAlign: "center" }}>
				Access denied - please log in as a Super Admin.
			</h2>
		);
	}

	// If I got here, it means user is logged in and has SUPER_ADMIN role
	// So now I allow the protected content to render.
	return children;
}
