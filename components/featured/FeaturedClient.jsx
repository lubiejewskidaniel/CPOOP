"use client"; // Client component because it uses state and button interactions

import { useState } from "react";
import { getFeaturedProductsAction } from "@/app/actions/featuredActions"; // Server Action (runs on the server)
import styles from "./FeaturedClient.module.css";

export default function FeaturedClient({ initialProducts }) {
	// Store the list in local state so the UI can refresh without a full page reload
	const [products, setProducts] = useState(initialProducts);

	// state for the refresh button
	const [loading, setLoading] = useState(false);

	// Small feedback message for potential errors
	const [message, setMessage] = useState("");

	// Refresh button - calls the Server Action to get latest data
	async function refresh() {
		try {
			setLoading(true);
			setMessage("");

			// This fetch happens also via Server Action - Firestore read is server-side
			const data = await getFeaturedProductsAction();

			// Update UI with the new list with message
			setProducts(data);
			setMessage("List refreshed.");
		} catch (err) {
			// again if anything bad happen, shows message instead of crashing
			setMessage("Something went wrong while refreshing.");
		} finally {
			setLoading(false);

			// Auto-hide message after 2 seconds
			setTimeout(() => setMessage(""), 2000);
		}
	}

	return (
		<div className={styles.page}>
			{/* Page heading */}
			<div className={styles.header}>
				<h1 className={styles.title}>Featured products</h1>
				<p className={styles.subtitle}>
					A quick list of products based on current stock levels.
				</p>
			</div>

			{/* Refresh button + short feedback message */}
			<div className={styles.toolbar}>
				<button className={styles.button} onClick={refresh} disabled={loading}>
					{loading ? "Refreshing..." : "Refresh list"}
				</button>
				{message && <p className={styles.message}>{message}</p>}
			</div>

			{/* Empty state */}
			{products.length === 0 ? (
				<div className={styles.empty}>No products found.</div>
			) : (
				/* Product list */
				<ul className={styles.list}>
					{products.map((p) => (
						<li key={p.id} className={styles.item}>
							{/* Left side: name + meta info */}
							<div className={styles.left}>
								<div className={styles.name}>{p.productName}</div>
								<div className={styles.meta}>
									{p.pharmacyName ? p.pharmacyName : "Unknown pharmacy"}
									{p.category ? ` • ${p.category}` : ""}
								</div>
							</div>

							{/* Right side: price + stock */}
							<div className={styles.right}>
								<div className={styles.price}>
									£{Number(p.price).toFixed(2)}
								</div>
								<div className={styles.stock}>Stock: {p.quantity}</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
