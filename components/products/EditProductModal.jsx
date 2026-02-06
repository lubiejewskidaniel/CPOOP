"use client";

// EditProductModal will be popup window for editing ONE product.
// I keep it as a client component because I use useState/useEffect + browser events (clicks, Escape key).
// Takes product props and copy into local sample draft then user edits and save to Firestore finally close modal.
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./EditProductModal.module.css";

// List of inputs I want to show in the modal.
// I keep them here so I don't repeat the same input code 6 times.
const editableProductFields = [
	{ name: "productName", label: "Product name", type: "text" },
	{ name: "category", label: "Category", type: "text" },
	{ name: "description", label: "Description", type: "text" },
	{ name: "expiryDate", label: "Expiry date", type: "date" },
	{ name: "price", label: "Price", type: "number" },
	{ name: "quantity", label: "Quantity", type: "number" },
];

export default function EditProductModal({ product, onClose }) {
	// I create a local editable copy of the product.
	// This is basically my draft version, so typing doesn't mutate props directly.
	const [productDraft, setProductDraft] = useState(() => ({
		productName: product.productName ?? "",
		category: product.category ?? "",
		description: product.description ?? "",
		expiryDate: product.expiryDate ?? "",
		price: product.price ?? "",
		quantity: product.quantity ?? "",
	}));

	// Small loading flag, when I click Save, I disable buttons so user can’t click twice.
	const [isSavingProductUpdate, setIsSavingProductUpdate] = useState(false);

	// Allow closing the modal with the Escape key.
	// I add an event listener on mount and remove it on unmount,
	// Because without removing it, the listener would stay active even after the modal is closed, and that causes problems.
	useEffect(() => {
		function closeOnEscape(event) {
			if (event.key === "Escape") onClose();
		}

		window.addEventListener("keydown", closeOnEscape);

		// Cleanup is important so I don't keep listeners when modal is closed.
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [onClose]);

	// One change manager for all inputs.
	// It updates the correct field using the input name attribute.
	function updateDraftField(event) {
		const { name, value } = event.target;

		setProductDraft((previousDraft) => ({
			...previousDraft,
			[name]: value,
		}));
	}

	// Form submit manager.
	// It confirms with the user, then updates Firestore, then closes the modal.
	async function saveProductUpdate(event) {
		event.preventDefault(); // prevent normal form refresh
		const userConfirmedSave = window.confirm("Save changes to this product?");
		if (!userConfirmedSave) return;

		setIsSavingProductUpdate(true);

		try {
			// Firestore reference to the product document I want to edit
			const productDocRef = doc(firestoreDatabase, "products", product.id);

			// Firestore expects numbers for price or quantity, so I convert them,
			// in case if inputs are strings by default.
			await updateDoc(productDocRef, {
				...productDraft,
				price: Number(productDraft.price),
				quantity: Number(productDraft.quantity),
			});

			// After saving, close the modal
			onClose();
		} catch (error) {
			// If saving fails, I keep the modal open and show a basic message

			alert("Action not possible, try again later.");
		} finally {
			// Always stop the loading state
			setIsSavingProductUpdate(false);
		}
	}

	return (
		// Overlay - dark background.
		// Clicking on the overlay closes the modal.
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modal}
				// This stops the click from bubbling to the overlay.
				// Without stopPropagation, clicking inside the modal would also close it.
				onClick={(e) => e.stopPropagation()}
			>
				<h3>Edit Product</h3>

				{/* Using a form means Enter key works + we can use onSubmit */}
				<form onSubmit={saveProductUpdate} className={styles.form}>
					{/* Build inputs from the list above to avoid repeating code */}
					{editableProductFields.map((field) => (
						<label key={field.name} className={styles.field}>
							<span className={styles.label}>{field.label}</span>

							{/* Controlled input - value comes from state, and onChange updates state */}
							<input
								name={field.name}
								type={field.type}
								value={productDraft[field.name]}
								onChange={updateDraftField}
								required
							/>
						</label>
					))}

					{/* Buttons */}
					<div className={styles.actions}>
						{/* Save button disabled while saving */}
						<button type="submit" disabled={isSavingProductUpdate}>
							{isSavingProductUpdate ? "Saving..." : "Save changes"}
						</button>

						{/* Cancel just closes the modal without saving */}
						<button
							type="button"
							onClick={onClose}
							disabled={isSavingProductUpdate}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
