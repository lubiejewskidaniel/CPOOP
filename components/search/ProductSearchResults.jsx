"use client";

/*
The ProductSearchResults component shows what happens after a user searches. 
It shows nothing before a search, displays a message if no products are found, 
and shows product cards when there are results. 
It mainly focuses on displaying the UI based on the data it receives.
This component is mainly for rendering UI based on props.
*/

import styles from "./Search.module.css";
import ProductCard from "./ProductCard";

export default function ProductSearchResults({ products, hasSearched }) {
	/*
	  If user has not searched yet, do not rendering anything.
	  This avoids showing "No products found" on page load.
	*/
	if (!hasSearched) return null;

	/*
	  If search was performed but no products match,
	  shows a friendly message to the user.
	*/
	if (!products.length) {
		return <p className={styles.noResults}>No products found</p>;
	}

	return (
		<div className={styles.resultsContainer}>
			<h3 className={styles.resultsTitle}>Search results</h3>

			{/* Render one ProductCard per product */}
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
