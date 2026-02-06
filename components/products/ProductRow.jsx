"use client";

// This is again client side component, renders ONE row in my products admin table.
// It's client-side because I use useState and browser actions as well.
// I show product info in table cells + 2 actions -edit open modal and delete remove from Firestore.
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import EditProductModal from "./EditProductModal";
import styles from "./ProductRow.module.css";

export default function ProductRow({ product }) {
	// Controls if the edit modal is visible or not
	const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);

	// flag for delete so user can't spams click the delete button
	const [isDeletingProduct, setIsDeletingProduct] = useState(false);

	// Deletes product from Firestore after confirmation
	async function deleteProduct() {
		const userConfirmedDelete = window.confirm(
			"Are you sure you want to delete this product?"
		);
		if (!userConfirmedDelete) return;

		setIsDeletingProduct(true);

		try {
			const productDocRef = doc(firestoreDatabase, "products", product.id);
			await deleteDoc(productDocRef);
		} catch (error) {
			alert("Unable to delete product. Please try again.");
		} finally {
			setIsDeletingProduct(false);
		}
	}

	return (
		<>
			<tr className={styles.row}>
				{/* Product info */}
				<td className={styles.cell}>{product.productName}</td>
				<td className={styles.cell}>{product.pharmacyName}</td>
				<td className={styles.cell}>{product.category}</td>
				<td className={styles.cell}>£{product.price}</td>
				<td className={styles.cell}>{product.quantity}</td>

				{/* Buttons for actions */}
				<td className={`${styles.cell} ${styles.actionsCell}`}>
					<div className={styles.actions}>
						<button
							type="button"
							className={styles.iconBtn}
							onClick={() => setIsEditPopupVisible(true)}
							title="Edit product"
							aria-label="Edit product"
						>
							✏️
						</button>

						<button
							type="button"
							className={`${styles.iconBtn} ${styles.dangerBtn}`}
							onClick={deleteProduct}
							disabled={isDeletingProduct}
							title="Delete product"
							aria-label="Delete product"
						>
							{isDeletingProduct ? "..." : "❌"}
						</button>
					</div>
				</td>
			</tr>

			{/* Edit modal only when needed */}
			{isEditPopupVisible && (
				<EditProductModal
					product={product}
					onClose={() => setIsEditPopupVisible(false)}
				/>
			)}
		</>
	);
}
