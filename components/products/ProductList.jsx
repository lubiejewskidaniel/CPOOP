"use client";
// Another client side componenet
// ProductList,shows all products owned by the logged-in admin.
// It uses Firestore onSnapshot, so the table updates live when products change.
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { useAuthentication } from "@/context/AuthContext";
import ProductRow from "./ProductRow";
import styles from "./ProductList.module.css";

export default function ProductList() {
	// I need the user id to load only products created by this admin
	const { authenticatedUser } = useAuthentication();

	// Stores products from Firestore
	const [ownedProducts, setOwnedProducts] = useState([]);

	// Simple loading state while I wait for the first Firestore snapshot
	const [isProductsLoading, setIsProductsLoading] = useState(true);

	useEffect(() => {
		// If user is not logged in, stop loading and clear results
		if (!authenticatedUser) {
			setOwnedProducts([]);
			setIsProductsLoading(false);
			return;
		}

		// Firestore query: only products where ownerId = current user uid
		const productsOwnedByUserQuery = query(
			collection(firestoreDatabase, "products"),
			where("ownerId", "==", authenticatedUser.uid)
		);

		// Live listener: Firestore pushes updates whenever something changes
		const unsubscribe = onSnapshot(productsOwnedByUserQuery, (snapshot) => {
			const mappedProducts = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setOwnedProducts(mappedProducts);
			setIsProductsLoading(false); // first snapshot = stop loading
		});

		// Cleanup listener when component unmounts or user changes
		return () => unsubscribe();
	}, [authenticatedUser]);

	// UI states
	if (isProductsLoading) return <p>Loading products...</p>;
	if (ownedProducts.length === 0) return <p>No products added yet.</p>;

	return (
		<table className={styles.table}>
			<thead>
				<tr>
					{/* Simple table headers */}
					<th>Product</th>
					<th>Pharmacy</th>
					<th>Category</th>
					<th>Price</th>
					<th>Quantity</th>
					<th className={styles.actionsCol}>Actions</th>
				</tr>
			</thead>

			<tbody>
				{/* Render one row per product */}
				{ownedProducts.map((product) => (
					<ProductRow key={product.id} product={product} />
				))}
			</tbody>
		</table>
	);
}
