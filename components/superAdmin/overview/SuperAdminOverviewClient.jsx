"use client";

// SuperAdminOverviewClient - client component because
// I use useState/useEffect and I load data from Firestore in the browser.
//Loads some basic counts (pharmacies/products/orders) and builds two warning lists
// (out of stock + expired). Then I show everything as clickable cards.
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./SuperAdminOverviewClient.module.css";
import StatCard from "./StatCard"; // I reuse my small card component to avoid repeating the same HTML

// Firestore gives me doc snapshots, but in the UI I prefer normal JS objects.
// I also keep doc.id, because it is useful for lists (key) and debugging.
function mapFirestoreDoc(docSnap) {
	return { id: docSnap.id, ...docSnap.data() };
}

// Checks if a product is expired.
// expiryDate comes from input type="date">, so it is usually a string like YYYY-MM-DD.
function isProductExpired(productData, today) {
	const expiryString = productData?.expiryDate;
	if (!expiryString) return false; // if no date saved I don't treat it as expired

	const expiryDate = new Date(expiryString);
	return expiryDate < today;
}

export default function SuperAdminOverviewClient() {
	// These are the main numbers I want to show on the cards.
	const [systemStats, setSystemStats] = useState({
		pharmaciesCount: 0,
		productsCount: 0,
		outOfStockCount: 0,
		expiredCount: 0,
		ordersCount: 0,
	});

	// These arrays are only for the expanded view - little list under the card.
	const [outOfStockProducts, setOutOfStockProducts] = useState([]);
	const [expiredProducts, setExpiredProducts] = useState([]);

	// here UI states so the user sees loading or errors instead of empty page.
	const [isStatsLoading, setIsStatsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);

	// Keeps track of which card is currently expanded.
	const [expandedPanelKey, setExpandedPanelKey] = useState(null);

	useEffect(() => {
		// Runs once when the component loads.
		// I fetch the data, calculate counts, and save everything in state.
		async function loadSystemStats() {
			setErrorMessage(null);

			try {
				// Read data from Firestore in a way of getting whole collections
				const pharmaciesSnap = await getDocs(
					collection(firestoreDatabase, "pharmacies")
				);
				const productsSnap = await getDocs(
					collection(firestoreDatabase, "products")
				);
				const ordersSnap = await getDocs(
					collection(firestoreDatabase, "orders")
				);

				// Creates today at midnight so date comparison is not messy
				const today = new Date();
				today.setHours(0, 0, 0, 0);

				// Now biuilding special groups of products for the details sections
				const outOfStockDocs = productsSnap.docs.filter(
					(docSnap) => Number(docSnap.data()?.quantity ?? 0) === 0
				);

				// and also only products where expiryDate < today
				const expiredDocs = productsSnap.docs.filter((docSnap) =>
					isProductExpired(docSnap.data(), today)
				);

				// below I want to save the main counters I mean numbers shown on top of cards
				setSystemStats({
					pharmaciesCount: pharmaciesSnap.size,
					productsCount: productsSnap.size,
					outOfStockCount: outOfStockDocs.length,
					expiredCount: expiredDocs.length,
					ordersCount: ordersSnap.size,
				});

				// now want to  save the lists for expanded cards (so I can show examples)
				setOutOfStockProducts(outOfStockDocs.map(mapFirestoreDoc));
				setExpiredProducts(expiredDocs.map(mapFirestoreDoc));
			} catch (error) {
				// If Firestore fails, I show a simple message so user knows what happened
				setErrorMessage("Unable to load overview. Please try again.");
			} finally {
				// I stop loading no matter what success or error, so it doesn't spin forever
				setIsStatsLoading(false);
			}
		}

		loadSystemStats();
	}, []);

	// Now I manage expanding and collapsing:
	// click the same card again will close it
	// click another card will  open that one and close previous
	function togglePanel(panelKey) {
		setExpandedPanelKey((previousKey) =>
			previousKey === panelKey ? null : panelKey
		);
	}

	// Kind of  "guard UI" so I don’t render the cards while data is missing.
	if (isStatsLoading) return <p>Loading overview...</p>;
	if (errorMessage) return <p className={styles.error}>{errorMessage}</p>;

	return (
		<div className={styles.page}>
			<h1 className={styles.title}>System Overview</h1>

			{/* container for all cards */}
			<div className={styles.grid}>
				<StatCard
					title="Total Pharmacies"
					value={systemStats.pharmaciesCount}
					isExpanded={expandedPanelKey === "pharmacies"}
					onToggle={() => togglePanel("pharmacies")}
				>
					<p className={styles.smallText}>
						This is how many pharmacies exist in the system.
					</p>
				</StatCard>

				<StatCard
					title="Total Products"
					value={systemStats.productsCount}
					isExpanded={expandedPanelKey === "products"}
					onToggle={() => togglePanel("products")}
				>
					<p className={styles.smallText}>
						Total number of single product records across all pharmacies.
					</p>
				</StatCard>

				<StatCard
					title="Out of Stock"
					value={systemStats.outOfStockCount}
					isExpanded={expandedPanelKey === "outOfStock"}
					onToggle={() => togglePanel("outOfStock")}
				>
					{/* When expanded, I either show "everything is in stock" or a short list of out of stock products */}
					{outOfStockProducts.length === 0 ? (
						<p className={styles.smallText}>Nice, everything is in stock.</p>
					) : (
						<>
							<ul className={styles.detailsList}>
								{outOfStockProducts.map((p) => (
									<li key={p.id}>
										{p.productName ?? "Unnamed product"}{" "}
										<span className={styles.muted}>
											({p.pharmacyName ?? "Unknown pharmacy"})
										</span>
									</li>
								))}
							</ul>

							<p className={styles.smallText}>
								Contact pharmacy to manage products.
							</p>
						</>
					)}
				</StatCard>

				<StatCard
					title="Expired Products"
					value={systemStats.expiredCount}
					isExpanded={expandedPanelKey === "expired"}
					onToggle={() => togglePanel("expired")}
				>
					{expiredProducts.length === 0 ? (
						<p className={styles.smallText}>No expired products found.</p>
					) : (
						<>
							<ul className={styles.detailsList}>
								{expiredProducts.map((p) => (
									<li key={p.id}>
										{p.productName ?? "Unnamed product"}{" "}
										<span className={styles.muted}>
											({p.pharmacyName ?? "Unknown pharmacy"})
										</span>
									</li>
								))}
							</ul>

							<p className={styles.smallText}>
								Contact pharmacy to manage products.
							</p>
						</>
					)}
				</StatCard>

				<StatCard
					title="Total Orders"
					value={systemStats.ordersCount}
					isExpanded={expandedPanelKey === "orders"}
					onToggle={() => togglePanel("orders")}
				>
					<p className={styles.smallText}>
						Total number of orders placed in the system so far.
					</p>
				</StatCard>
			</div>

			<p className={styles.hint}>
				Tip: click a card to expand / collapse details.
			</p>
		</div>
	);
}
