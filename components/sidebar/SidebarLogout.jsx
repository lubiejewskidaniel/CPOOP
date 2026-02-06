"use client";

/*
  This component handles user logout.
  Checks if the cart has items before logging out and shows a confirmation message if cart is not empty.
  Also clears cart state and localStorage, signs the user out from Firebase Authentication
  Finally redirects the user to the home page
  use of browser APIs (window.confirm), context and router makes it again user side component
*/

import { signOut } from "firebase/auth";
import { authenticationInstance } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import styles from "./Sidebar.module.css";
import { useRouter } from "next/navigation";

export default function SidebarLogout() {
	//  router for navigation
	const router = useRouter();

	// Gets cart data and clear function from context
	const { cartItems, clearCart } = useCart();

	function handleLogout() {
		// If cart is not empty, confirm logout with user
		// I used window.confirm to show a popup message that asks the user to confirm before logging out.
		// This is important because if the cart is not empty, logging out will clear it.
		// The confirmation window helps prevent the user from accidentally losing their cart items.
		if (cartItems.length > 0) {
			const confirmLogout = window.confirm(
				"If you log out, your cart will be cleared. Do you want to continue?"
			);

			// Stops logout if user cancels
			if (!confirmLogout) return;
		}

		// Clears cart state and localStorage
		clearCart();

		// Signs out from Firebase Authentication
		signOut(authenticationInstance);

		// Redirecting user to home page
		router.push("/");
	}

	return (
		<button className={styles.logoutButton} onClick={handleLogout}>
			Log out
		</button>
	);
}
