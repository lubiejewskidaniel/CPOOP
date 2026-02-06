"use client";

// Products admin page again client-side
// Only PHARMACY_ADMIN can access it. Others are redirected.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/context/AuthContext";
import ManageProducts from "@/components/products/ManageProducts";

export default function ProductsClient() {
	const router = useRouter();

	// Auth values from context decides if user can enter this page
	const {
		authenticatedUser: signedInUser,
		userRole: signedInUserRole,
		isAuthenticationLoading: isAuthStillLoading,
	} = useAuthentication();

	useEffect(() => {
		// Wait until auth is fully loaded
		if (isAuthStillLoading) return;

		// Not logged in them go to loginOrRegister
		if (!signedInUser) {
			router.replace("/loginOrRegister");
			return;
		}

		// Logged in but wrong role redirected to home
		if (signedInUserRole !== "PHARMACY_ADMIN") {
			router.replace("/");
		}
	}, [isAuthStillLoading, signedInUser, signedInUserRole, router]);

	// an below lets say UI states
	if (isAuthStillLoading) return <p>Loading...</p>;
	if (!signedInUser) return <p>Redirecting to login...</p>;
	if (signedInUserRole !== "PHARMACY_ADMIN") return <p>Access denied.</p>;

	return <ManageProducts />;
}
