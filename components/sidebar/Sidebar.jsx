"use client";

/*
The Sidebar component displays the main sidebar depending on the logged-in user’s role. 
Client component because it relies on authentication and user state.
It gets the user’s authentication and role from context, waits for the data to load, 
shows different menu items for each role, and always includes the header and logout sections. 

*/

import { useAuthentication } from "@/context/AuthContext";
import SidebarHeader from "./SidebarHeader";
import SidebarLogout from "./SidebarLogout";
import UserSidebarMenu from "./UserSidebarMenu";
import PharmacyAdminSidebarMenu from "./PharmacyAdminSidebarMenu";
import SuperAdminSidebarMenu from "./SuperAdminSidebarMenu";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
	// Get authentication data from context
	const {
		authenticatedUser,
		userRole,
		isAuthenticationLoading,
		isUserProfileLoading,
	} = useAuthentication();

	//  Do not render sidebar until authentication is finished, user profile is loaded, user is logged in
	if (isAuthenticationLoading || isUserProfileLoading || !authenticatedUser) {
		return null;
	}

	return (
		<aside className={styles.sidebar}>
			{/* Top Section: Logo / user info */}
			<SidebarHeader />

			{/* Siede Menu Section: Role based navigation */}
			{userRole === "USER" && <UserSidebarMenu />}

			{userRole === "PHARMACY_ADMIN" && <PharmacyAdminSidebarMenu />}

			{userRole === "SUPER_ADMIN" && <SuperAdminSidebarMenu />}

			{/* Bottom Section: Logout button */}
			<SidebarLogout />
		</aside>
	);
}
