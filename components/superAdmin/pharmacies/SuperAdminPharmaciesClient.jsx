"use client";

// This is CLIENT component because also I use react state + useEffect.
// Goal here is simple, to load all pharmacies from Firestore and show only their names,
// as per assesment criteria
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./SuperAdminPharmaciesClient.module.css";

export default function SuperAdminPharmaciesClient() {
	// I keep the loaded pharmacy names here, this is what I render in the list.
	const [pharmacyNameList, setPharmacyNameList] = useState([]);

	// Again I keep flags so the page doesn’t look empty while loading or also when error happens.
	const [isPharmacyListLoading, setIsPharmacyListLoading] = useState(true);
	const [loadingProblemMessage, setLoadingProblemMessage] = useState(null);

	useEffect(() => {
		// This function runs once when the page loads of course.
		// It fetches pharmacies from Firestore and saves them into state.
		async function fetchPharmacyNames() {
			setLoadingProblemMessage(null);

			try {
				// I order by name just so the list looks nicer and not random.
				const pharmaciesByNameQuery = query(
					collection(firestoreDatabase, "pharmacies"),
					orderBy("name", "asc")
				);

				const pharmacySnapshot = await getDocs(pharmaciesByNameQuery);

				// Here firestore returns doc snapshots, so I map them into plain objects.
				// And I keep doc.id for React key + debugging, and name for display an in other components.
				const pharmacyRows = pharmacySnapshot.docs.map((docSnap) => ({
					id: docSnap.id,
					name: docSnap.data()?.name ?? "Unnamed pharmacy",
				}));

				setPharmacyNameList(pharmacyRows);
			} catch (error) {
				setLoadingProblemMessage(
					"Unable to load pharmacies. Please try again later."
				);
			} finally {
				// I stop loading, to avoid stack on loading or error
				setIsPharmacyListLoading(false);
			}
		}

		fetchPharmacyNames();
	}, []);

	// Again some guards for UI states so user sees what is going on
	if (isPharmacyListLoading) return <p>Loading pharmacies...</p>;
	if (loadingProblemMessage)
		return <p className={styles.error}>{loadingProblemMessage}</p>;
	if (pharmacyNameList.length === 0) return <p>No pharmacies found.</p>;

	return (
		<div className={styles.page}>
			<h1 className={styles.title}>All Pharmacies</h1>

			{/* JList of pharmacy names */}
			<ul className={styles.list}>
				{pharmacyNameList.map((pharmacy) => (
					<li key={pharmacy.id} className={styles.item}>
						{pharmacy.name}
					</li>
				))}
			</ul>
		</div>
	);
}
