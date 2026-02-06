"use client";
// Client component.
// PharmacyItem shows one pharmacy card in the list.
// It lets the admin edit the pharmacy, opens modal, or delete it.

import { useState } from "react";
import EditPharmacyModal from "./EditPharmacyModal";
import {
	doc,
	deleteDoc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./PharmacyItem.module.css";

export default function PharmacyItem({ pharmacy }) {
	// Controls if the edit modal is visible
	const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);

	// Small loading flag so user can't spam delete
	const [isDeleting, setIsDeleting] = useState(false);

	async function deletePharmacyWithProducts() {
		// Ask user first (deleting also removes all products)
		const userConfirmedDelete = window.confirm(
			"Are you sure you want to delete this pharmacy?\n\nAll products assigned to this pharmacy will also be permanently removed."
		);

		if (!userConfirmedDelete) return;

		setIsDeleting(true);

		try {
			// First find all products that belong to this pharmacy
			const productsLinkedToPharmacyQuery = query(
				collection(firestoreDatabase, "products"),
				where("pharmacyId", "==", pharmacy.id)
			);

			const productsSnapshot = await getDocs(productsLinkedToPharmacyQuery);

			// Second delete all those products
			const deleteRequests = productsSnapshot.docs.map((productDoc) =>
				deleteDoc(doc(firestoreDatabase, "products", productDoc.id))
			);

			await Promise.all(deleteRequests);

			// and delete the pharmacy itself
			await deleteDoc(doc(firestoreDatabase, "pharmacies", pharmacy.id));
		} catch (error) {
			alert(
				"Sorry You are unable to delete pharmacy at the moment. Please try again."
			);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<div className={styles.card}>
				{/* Pharmacy info */}
				<strong className={styles.title}>{pharmacy.name}</strong>

				<div className={styles.meta}>{pharmacy.addressLine1}</div>
				<div className={styles.meta}>
					{pharmacy.postCode}, {pharmacy.town}
				</div>

				{/* buttons */}
				<div className={styles.actions}>
					<button
						className={styles.deleteBtn}
						onClick={deletePharmacyWithProducts}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</button>

					<button
						className={styles.editBtn}
						onClick={() => setIsEditPopupVisible(true)}
						disabled={isDeleting}
					>
						Edit
					</button>
				</div>
			</div>

			{/* Edit modal only shown when user clicks Edit */}
			{isEditPopupVisible && (
				<EditPharmacyModal
					pharmacy={pharmacy}
					onClose={() => setIsEditPopupVisible(false)}
				/>
			)}
		</>
	);
}
