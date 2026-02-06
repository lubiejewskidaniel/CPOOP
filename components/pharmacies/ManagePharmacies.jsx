"use client";
// client side component.
// ManagePharmacies is the main admin screen for pharmacies.
// It shows the list, and it can open/close the Add pharmacy form.
import { useState } from "react";
import PharmacyForm from "./PharmacyForm";
import PharmacyList from "./PharmacyList";
import styles from "./ManagePharmacies.module.css";

export default function ManagePharmacies() {
	const [isAddFormOpen, setIsAddFormOpen] = useState(false);

	function toggleAddForm() {
		setIsAddFormOpen((previousValue) => !previousValue);
	}

	return (
		<div className={styles.page}>
			{/* Title + action button centered */}
			<div className={styles.header}>
				<h1 className={styles.title}>Registered Pharmacies</h1>

				<div className={styles.actions}>
					<button onClick={toggleAddForm}>
						{isAddFormOpen ? "Hide form" : "Add pharmacy"}
					</button>
				</div>
			</div>

			{/* Form */}
			{isAddFormOpen && (
				<PharmacyForm onCancel={() => setIsAddFormOpen(false)} />
			)}

			{/* List */}
			<div className={styles.listWrapper}>
				<PharmacyList />
			</div>
		</div>
	);
}
