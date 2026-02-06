"use client";

// Pharmacies admin page has to be client-side as again useEffect is in use..
// Only PHARMACY_ADMIN can access it. Others are redirected.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/context/AuthContext";
import ManagePharmacies from "@/components/pharmacies/ManagePharmacies";

export default function PharmaciesClient() {
	const router = useRouter();

	// Auth data from context as need this informations to controll access to my app
	// signedInUser - tells if someone is logged in
	// signedInUserRole - tells if the user is allowed to manage pharmacies - PHARMACY_ADMIN is onlu allowed!
	// isAuthStillLoading -  prevents redirecting too early while Firebase is still checking the session
	const {
		authenticatedUser: signedInUser,
		userRole: signedInUserRole,
		isAuthenticationLoading: isAuthStillLoading,
	} = useAuthentication();

	useEffect(() => {
		// Wait until auth is fully loaded before redirecting
		if (isAuthStillLoading) return;

		// Not logged in user is send to login/register page
		if (!signedInUser) {
			router.replace("/loginOrRegister");
			return;
		}

		// Logged in but not pharmacy admin have to be send to home
		if (signedInUserRole !== "PHARMACY_ADMIN") {
			router.replace("/");
		}
	}, [isAuthStillLoading, signedInUser, signedInUserRole, router]);

	// While loading simple message has to be visable.
	// Maybe will change it to reusable hook later
	if (isAuthStillLoading) {
		return <p>Loading...</p>;
	}

	// If redirect is happening want to keep UI simple
	if (!signedInUser) {
		return <p>Redirecting to login...</p>;
	}

	// If user is not allowed to access want to show info and redirect will also happen.
	if (signedInUserRole !== "PHARMACY_ADMIN") {
		return <p>Access denied.</p>;
	}

	// If user is allowed user to have access will show admin panel for Pharmacy Admin.
	return <ManagePharmacies />;
}
