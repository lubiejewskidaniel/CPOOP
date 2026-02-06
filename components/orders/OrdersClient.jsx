"use client";

// This component is the main Orders page client-side of course because it uses state and effects.
// It loads the logged-in user's order history from Firestore and lets the user collapose an order to see details.
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { useAuthentication } from "@/context/AuthContext";

import OrdersList from "./OrdersList";
import styles from "./OrdersClient.module.css";

export default function OrdersClient() {
	// Gest current user info from the auth context
	const { authenticatedUser, isAuthenticationLoading } = useAuthentication();

	// Stores all fetched orders for the user
	const [userOrderHistory, setUserOrderHistory] = useState([]);

	// Stores which order is currently opened I mean expanded but null = none opened
	const [currentlyExpandedOrderId, setCurrentlyExpandedOrderId] =
		useState(null);

	// Local loading flag for fetching orders from Firestore
	const [isOrdersFetching, setIsOrdersFetching] = useState(true);

	useEffect(() => {
		// Loads orders from Firestore when the logged-in user changes
		async function loadOrdersForSignedInUser() {
			// No user = no orders to load
			if (!authenticatedUser) {
				setIsOrdersFetching(false);
				return;
			}

			try {
				// Query to to show only orders that belong to this user, newest first
				const firestoreOrdersQuery = query(
					collection(firestoreDatabase, "orders"),
					where("userId", "==", authenticatedUser.uid),
					orderBy("createdAt", "desc")
				);

				const ordersSnapshot = await getDocs(firestoreOrdersQuery);

				// Convert Firestore docs into normal js objects what reduse working with
				// Firestore snapshot methods i n my UI also is easier to pass prder around as a normal object.
				const mappedOrders = ordersSnapshot.docs.map((documentSnapshot) => ({
					id: documentSnapshot.id,
					...documentSnapshot.data(),
				}));

				setUserOrderHistory(mappedOrders);
			} catch (error) {
				console.error("fetch orders not possible:", error); // needs for debuging for now!!! - will manage it later
			} finally {
				setIsOrdersFetching(false);
			}
		}

		loadOrdersForSignedInUser();
	}, [authenticatedUser]);

	// Opens an order if it's closed, or closes it if it's already open
	function toggleExpandedOrder(orderIdToToggle) {
		setCurrentlyExpandedOrderId((previousOrderId) =>
			previousOrderId === orderIdToToggle ? null : orderIdToToggle
		);
	}

	// Show loading while auth or Firestore data is still loading
	// maybe will change to hook later on.
	if (isAuthenticationLoading || isOrdersFetching) {
		return <p>Loading orders...</p>;
	}

	// If user is not logged in, block the page what stops the page from
	// showing orders when is no user.
	if (!authenticatedUser) {
		return <p>Please log in to view your orders.</p>;
	}

	// Logged in but no orders found - frindly message for better UI
	if (userOrderHistory.length === 0) {
		return <h2>You have no past orders.</h2>;
	}

	// Block of ifs above also are done to give little security to app, in the sense
	// that it prevents showing the UI to someone not logged in.

	return (
		<div className={styles.page}>
			<h1>My Past Orders</h1>

			{/* OrdersList displays the cards and handles expanded view using props */}
			<OrdersList
				orders={userOrderHistory}
				expandedOrderId={currentlyExpandedOrderId}
				onToggleOrder={toggleExpandedOrder}
			/>
		</div>
	);
}
