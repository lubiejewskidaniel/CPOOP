"use client";

// I keep this as a client component because Firestore "onSnapshot" works in the browser
// and I also use react state
// This page shows ALL products in a table and keep it updated LIVE.
// This was a big challange - again i did some self discovering through react and next documentation
// to find a way to use properly onSnapshot function, it gave me some issues to implement hoverwer after
// few attempts i reached my goal and now it is working as i expecting
// I hop it is fulfilling assesment requirements point e "...by monitoring inventory levels in real-time."
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./SuperAdminProductsClient.module.css";

export default function SuperAdminProductsClient() {
	// This is basically my table data.
	// Each object here becomes one row.
	const [productTableRows, setProductTableRows] = useState([]);

	// I show "Loading..." until Firestore gives me the first snapshot.
	const [isProductTableLoading, setIsProductTableLoading] = useState(true);

	// If Firestore fails, I store a simple message here and display it.
	const [problemMessage, setProblemMessage] = useState(null);

	useEffect(() => {
		// Every time this component mounts, I clear old error message.
		setProblemMessage(null);

		// Build a Firestore query, taking all docs from "products"
		// and sort them by productName ascending so it’s not random order of them
		const productsQuery = query(
			collection(firestoreDatabase, "products"),
			orderBy("productName", "asc")
		);

		// onSnapshot - this is my LIVE listener.
		// It will run callback function onc,  right away and it will be my initial data,
		// and then again every time something changes in Firestore.
		const unsubscribe = onSnapshot(
			productsQuery,
			(liveChange) => {
				// Firestore gives doc snapshots, so I turn them into plain JS objects.
				// As in a lot places in other components.
				// I only keep fields I actually show in the table.
				// This is part of my self learning mentioned earlier.
				const rows = liveChange.docs.map((stateSnapshot) => ({
					id: stateSnapshot.id, // I need this for react key, it is important. As have no id in firestore.
					productName: stateSnapshot.data()?.productName ?? "Unnamed product",
					pharmacyName:
						stateSnapshot.data()?.pharmacyName ?? "Unknown pharmacy",
					quantity: Number(stateSnapshot.data()?.quantity ?? 0),
				}));

				// Save the rows in state so react re-renders the table
				setProductTableRows(rows);

				// After the first snapshot arrives, I can stop showing "Loading..." message
				setIsProductTableLoading(false);
			},
			(error) => {
				// This runs if the listener fails becouse of server or permissionso or other things
				setProblemMessage("Unable to load products. Please try again later.");

				// Stop loading here too, so the page doesn't spin forever
				setIsProductTableLoading(false);
			}
		);

		// When I leave this page, I stop listening to Firestore.
		// If I don't do this, it can keep running in the background and waste resources.
		return () => unsubscribe();
	}, []);

	// Like in other component sae here I used guard UI so user sees what's going on
	if (isProductTableLoading) return <p>Loading products...</p>;
	if (problemMessage) return <p className={styles.error}>{problemMessage}</p>;
	if (productTableRows.length === 0) return <p>No products found.</p>;

	return (
		<div className={styles.page}>
			<h1 className={styles.title}>All Products</h1>

			{/* Wrapper is here mostly for responsiveness -table can scroll on small screens */}
			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Product</th>
							<th>Pharmacy</th>
							<th>Stock</th>
						</tr>
					</thead>

					<tbody>
						{productTableRows.map((row) => {
							// Here i put  UI rule:
							// stock = 0 - red row
							// stock < 20 -  orange row
							// elserows are black as normal
							const stockClass =
								row.quantity === 0
									? styles.stockZero
									: row.quantity < 20
									? styles.stockLow
									: "";

							return (
								<tr key={row.id} className={stockClass}>
									<td>{row.productName}</td>
									<td>{row.pharmacyName}</td>
									<td>{row.quantity}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
