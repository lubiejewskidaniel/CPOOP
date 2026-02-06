"use client";

/*
The SearchByCategory component lets the user choose a category to search for products. 
It fetches matching products from Firestore, sends the results to the parent component, 
and shows a loading state while searching. It is a client component because it uses again 
react state and runs a Firestore query when the user clicks a button.
*/

import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./Search.module.css";

export default function SearchByCategory({ onResults }) {
	// Stores the currently selected category
	const [selectedCategory, setSelectedCategory] = useState("");

	// Tracks whether a search request is in progress
	const [isSearching, setIsSearching] = useState(false);

	// Handle search button click
	async function handleSearch() {
		// Do nothing if no category is selected
		if (!selectedCategory) {
			return;
		}

		// Starting loading state
		setIsSearching(true);

		// Creates Firestore query to filter products by category
		const productsQuery = query(
			collection(firestoreDatabase, "products"),
			where("category", "==", selectedCategory)
		);

		// Executing query
		const snapshot = await getDocs(productsQuery);

		// Convert Firestore docs to plain JS objects typically as also in other components earlier
		const searchResults = snapshot.docs.map((document) => ({
			id: document.id,
			...document.data(),
		}));

		// Sends results back to parent component
		onResults(searchResults);

		// Stop loading state
		setIsSearching(false);
	}

	return (
		<div className={styles.searchBox}>
			<label className={styles.label}>Search by category</label>

			{/* Category dropdown */}
			<select
				className={styles.select}
				value={selectedCategory}
				onChange={(event) => setSelectedCategory(event.target.value)}
			>
				<option value="">Select category</option>
				<option value="Prescription Meds">Prescription Meds</option>
				<option value="Over-the-counter Meds">Over-the-counter Meds</option>
				<option value="Wellness Products">Wellness Products</option>
			</select>

			<button
				className={styles.button}
				onClick={handleSearch}
				disabled={!selectedCategory || isSearching}
			>
				{isSearching ? "Searching..." : "Search"}
			</button>
		</div>
	);
}
