// Displays product search results based on the current search state.
// Server component but will render client component anyway.
import ProductSearchResults from "@/components/search/ProductSearchResults";

export default function ResultsPanel({ products, hasSearched }) {
	return <ProductSearchResults products={products} hasSearched={hasSearched} />;
}
