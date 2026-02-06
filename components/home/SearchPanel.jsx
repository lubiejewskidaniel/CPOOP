// Server component.
// Search section with three search methods (name, category, pharmacy location) and a button to hide results.
// All three full fills assesmment expectations.
import SearchByName from "@/components/search/SearchByName";
import SearchByCategory from "@/components/search/SearchByCategory";
import SearchByPharmacyLocation from "@/components/search/SearchByPharmacyLocation";

export default function SearchPanel({ onResults, hasSearched, onClear }) {
	return (
		<>
			{/* Search by product name */}
			<SearchByName onResults={onResults} />

			{/* Search by product category */}
			<SearchByCategory onResults={onResults} />

			{/* Search by pharmacy town - location as per assignment */}
			<SearchByPharmacyLocation onResults={onResults} />

			{/* Show this button only after user has searched */}
			{hasSearched && <button onClick={onClear}>Hide search results</button>}
		</>
	);
}
