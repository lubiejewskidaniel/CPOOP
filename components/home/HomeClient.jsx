// Client side home page container.
// Ideally keeps search state and composes search UI, results, and the pharmacies map.
"use client";

import { useState } from "react";
import styles from "./HomeClient.module.css";

import SearchPanel from "./SearchPanel";
import ResultsPanel from "./ResultsPanel";
import PharmaciesMap from "@/components/map/PharmaciesMap";

export default function HomeClient() {
	const [searchResults, setSearchResults] = useState(null);

	// Called by search components when firestore returns matching products.
	function handleResults(results) {
		setSearchResults(results);
	}
	// Clears/hides the current search results and returns to the default home view.
	function clearSearchResults() {
		setSearchResults(null);
	}
	// Flag used to  show Hide results button only after a search.
	const hasSearched = searchResults !== null;

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<SearchPanel
					onResults={handleResults}
					hasSearched={hasSearched}
					onClear={clearSearchResults}
				/>

				{/* Search results list - empty array when searchResults is null */}
				<ResultsPanel
					products={searchResults ?? []}
					hasSearched={hasSearched}
				/>

				{/* Map is always visible so user can browse pharmacies visually */}
				<div className={styles.mapWrapper}>
					<PharmaciesMap />
				</div>
			</div>
		</div>
	);
}
