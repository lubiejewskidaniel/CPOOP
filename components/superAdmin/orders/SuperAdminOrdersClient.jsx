"use client";

// This component is the ALL ORDERS screen for the super admin.
// This is a Client Component because I use useState/useEffect to load data and handle UI clicks.
// When the page loads, I fetch ALL orders from Firestore -newest first.
// I want show loading or error or empty states so the UI is not blank.
// I will reuse the same OrderCard component from Past Orders, but I also show the user name here.
// Iwill keep one expandedOrderId so only one order is expanded at a time click will expand or collapse.
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import OrderCard from "@/components/orders/OrderCard";
import styles from "./SuperAdminOrdersClient.module.css";

export default function SuperAdminOrdersClient() {
	// All orders loaded from Firestore
	const [allOrders, setAllOrders] = useState([]);

	// Stores which order is currently expanded, null means none
	const [expandedOrderId, setExpandedOrderId] = useState(null);

	//again some  UI states for loading and errors
	const [isOrdersLoading, setIsOrdersLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		// I load orders only once when the component appears,empty dependency array []
		async function loadAllOrders() {
			setErrorMessage(null);

			try {
				// Firestore query to get orders sorted by createdAt what will give me newest first
				const ordersQuery = query(
					collection(firestoreDatabase, "orders"),
					orderBy("createdAt", "desc")
				);

				// Run the query once - admin view doesn't need live updates right now
				// as it is not assessment requirements
				const snapshot = await getDocs(ordersQuery);

				// Convert Firestore docs into normal JS objects + keep doc.id, I mean Firestore
				// gives me DocumentSnapshot objects, so I convert them to plain JS objects.
				// and I also copy doc.id because data() doesn’t include the id.
				const mappedOrders = snapshot.docs.map((docSnap) => ({
					id: docSnap.id,
					...docSnap.data(),
				}));

				setAllOrders(mappedOrders);
			} catch (error) {
				// If something fails, I show a friendly message.
				// In this situation I using it as a guard for route.
				// If user is not loged in will see message below.
				setErrorMessage("Unable to load orders. Please log in.");
			} finally {
				// Stop loading no matter what - success or error
				// ecause if I don’t stop loading in the error case, the page can get stuck showing "Loading…" forever.
				setIsOrdersLoading(false);
			}
		}

		loadAllOrders();
	}, []);

	// This is my expand and collapse logic.
	// If I click the same order again will collapse it.
	// If I click a different order will expand that one instead.
	function toggleOrder(orderIdToToggle) {
		setExpandedOrderId((previousId) =>
			previousId === orderIdToToggle ? null : orderIdToToggle
		);
	}

	// Some UI states so user knows what's happening
	if (isOrdersLoading) return <p>Loading orders...</p>;
	if (errorMessage) return <p className={styles.error}>{errorMessage}</p>;
	if (allOrders.length === 0) return <p>No orders found.</p>;

	return (
		<div className={styles.page}>
			<h1 className={styles.title}>All Orders</h1>

			{/* I reuse OrderCard from the normal user orders page.
			    Difference here is I pass showUserName=true because super admin wants to see who ordered. */}
			<div className={styles.list}>
				{allOrders.map((order) => (
					<OrderCard
						key={order.id} // added as React needs a stable key for list items
						order={order}
						isExpanded={expandedOrderId === order.id}
						onToggle={() => toggleOrder(order.id)}
						showUserName={true}
					/>
				))}
			</div>
		</div>
	);
}
