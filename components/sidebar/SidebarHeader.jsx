"use client";

/*
The SidebarHeader component - basic details about the logged-in user at the top of the sidebar. 
It displays a welcome message, the user’s name or email, and their role in a readable way. 
It is of course a client component because it uses authentication context and and again depends on user data.
*/

import { useAuthentication } from "@/context/AuthContext";
import styles from "./Sidebar.module.css";

export default function SidebarHeader() {
	// Get authenticated user and role from context
	const { authenticatedUser, userRole } = useAuthentication();

	/*
	  Maps role values to readable names
	  UI friendly way
	*/
	const roleLabels = {
		USER: "User",
		PHARMACY_ADMIN: "Pharmacy Admin",
		SUPER_ADMIN: "Super Admin",
	};

	return (
		<div className={styles.sidebarHeader}>
			{/* Welcome text */}
			<span className={styles.welcomeText}>Welcome</span>

			{/* User display name or fallback to email */}
			<span
				className={styles.userName}
				title={authenticatedUser?.displayName || authenticatedUser?.email}
			>
				{authenticatedUser?.displayName || authenticatedUser?.email}
			</span>

			{/* User role */}
			<span className={styles.userRole}>{roleLabels[userRole]}</span>
		</div>
	);
}
