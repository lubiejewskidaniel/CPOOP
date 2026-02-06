"use client";

/*
The SearchByPharmacyLocation component allows users to look for products based on the town where a pharmacy is located. 
It gets a list of towns, suggests matches while the user types, finds pharmacies in the chosen town, 
retrieves their products, and passes the results to the parent component. 
It works as a client component because it manages state, 
runs Firestore queries, and responds to user input.
*/

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./Search.module.css";

export default function SearchByPharmacyLocation({ onResults }) {
	// Stores all unique towns from Firestore
	const [allTowns, setAllTowns] = useState([]);

	// Storing towns filtered based on user input
	const [filteredTowns, setFilteredTowns] = useState([]);

	// Stores currently selected typed town
	const [selectedTown, setSelectedTown] = useState("");

	// Tracks loading state while searchingQC
	const [isSearching, setIsSearching] = useState(false);

	//  LOADING UNIQUE TOWNS FROM FIRESTORE
	useEffect(() => {
		async function loadTowns() {
			// Gets all pharmacies
			const snapshot = await getDocs(
				collection(firestoreDatabase, "pharmacies"),
			);

			// Extracts town names and remove empty values
			const towns = snapshot.docs.map((doc) => doc.data().town).filter(Boolean);

			// Removes duplicates and sort alphabetically
			const uniqueTowns = [...new Set(towns)].sort();

			setAllTowns(uniqueTowns);
			setFilteredTowns(uniqueTowns);
		}

		loadTowns();
	}, []);

	// FILTER TOWNS AS USER TYPES
	function handleTownInputChange(inputValue) {
		// Updating selected town
		setSelectedTown(inputValue);

		// Filter towns that start with typed value, case-insensitive for better usage
		const matchingTowns = allTowns.filter((town) =>
			town.toLowerCase().startsWith(inputValue.toLowerCase()),
		);

		setFilteredTowns(matchingTowns);
	}

	// SEARCH PRODUCTS BY LOCATION
	async function handleSearch() {
		// Do nothing if no town is selected
		if (!selectedTown) return;

		setIsSearching(true);

		// Finding pharmacies in the selected town
		const pharmaciesQuery = query(
			collection(firestoreDatabase, "pharmacies"),
			where("town", "==", selectedTown),
		);

		const pharmaciesSnapshot = await getDocs(pharmaciesQuery);

		// Gets pharmacy IDs
		const pharmacyIds = pharmaciesSnapshot.docs.map((doc) => doc.id);

		// If no pharmacies found, return empty results
		if (pharmacyIds.length === 0) {
			onResults([]);
			setIsSearching(false);
			return;
		}

		// Here finding products for those pharmacies
		// Firestore "in" query allows max 10 values
		const productsQuery = query(
			collection(firestoreDatabase, "products"),
			where("pharmacyId", "in", pharmacyIds.slice(0, 10)),
		);

		const productsSnapshot = await getDocs(productsQuery);

		// Converting to object js again
		const searchResults = productsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Send results back to parent component
		onResults(searchResults);

		setIsSearching(false);
	}

	return (
		<div className={styles.searchBox}>
			<label className={styles.label}>
				Search products by pharmacy location
			</label>

			<input
				className={styles.input}
				list="towns"
				placeholder="Type or choose location"
				value={selectedTown}
				onChange={(e) => handleTownInputChange(e.target.value)}
			/>

			<datalist id="towns">
				{filteredTowns.map((town) => (
					<option key={town} value={town} />
				))}
			</datalist>

			<button
				className={styles.button}
				onClick={handleSearch}
				disabled={!selectedTown || isSearching}
			>
				{isSearching ? "Searching..." : "Search"}
			</button>
		</div>
	);
}
