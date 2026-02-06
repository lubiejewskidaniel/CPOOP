"use client";

/*
It is again a client component because it uses react state and executing Firestore queries.
The SearchByName component lets the user search for products by typing a name. 
It looks up matching products in Firestore, sends the results to the parent component, 
and shows a loading state while searching. 
*/

import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./Search.module.css";

export default function SearchByName({ onResults }) {
	// Stores the search text entered by the user
	const [searchValue, setSearchValue] = useState("");

	// Tracks whether the search request is in progress
	const [isLoading, setIsLoading] = useState(false);

	//  Handle search button click
	async function handleSearch() {
		// Do not search if input is empty or only spaces
		if (!searchValue.trim()) return;

		// Loading state
		setIsLoading(true);

		/*
		  Firestore "starts with" query
		  \uf8ff is a special character that helps
		  match all values that start with searchValue, 
		  again is self learning as suppose it will be nice for UX/UI 
		*/
		const productsQuery = query(
			collection(firestoreDatabase, "products"),
			where("productName", ">=", searchValue),
			where("productName", "<=", searchValue + "\uf8ff")
		);

		// Execute query
		const snapshot = await getDocs(productsQuery);

		// same as in other components making JS object
		const searchResults = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Send results back to parent component
		onResults(searchResults);

		// Stop loading state
		setIsLoading(false);
	}

	return (
		<div className={styles.searchBox}>
			<label className={styles.label}>Search by product name</label>

			<input
				className={styles.input}
				placeholder="e.g. Paracetamol"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
			/>

			<button className={styles.button} onClick={handleSearch}>
				{isLoading ? "Searching..." : "Search"}
			</button>
		</div>
	);
}
