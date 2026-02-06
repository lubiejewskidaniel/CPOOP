// Again it gonna be client component becouse this modal will use features works only inbrowser
// like useSTate, useEffect, window.addEventListener and also will reacts to clicks - onClick, onClose
"use client";

// EditPharmacyModal gonna be a simple popup window for editing one pharmacy.
// The idea is will copy the pharmacy data into local state, user edits inputs, then save to Firestore.
// After saving or clicking outside, pressing Escape, the modal closes. Usability!
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import styles from "./EditPharmacyModal.module.css";

// List of fields I want to show in the form.
// Using this array meansI don't have to cop and paste 8 inputs manually.
const editableFields = [
	{ name: "name", label: "Pharmacy name" },
	{ name: "addressLine1", label: "Address line 1" },
	{ name: "postCode", label: "Post code" },
	{ name: "town", label: "Town" },
	{ name: "phone", label: "Phone" },
	{ name: "email", label: "Email" },
	{ name: "latitude", label: "Latitude" },
	{ name: "longitude", label: "Longitude" },
];

export default function EditPharmacyModal({ pharmacy, onClose }) {
	// Local editable copy lets say draft of the pharmacy.
	// I want to do this so don't directly change props while typing.
	const [pharmacyDraft, setPharmacyDraft] = useState(() => ({
		name: pharmacy.name || "",
		addressLine1: pharmacy.addressLine1 || "",
		postCode: pharmacy.postCode || "",
		town: pharmacy.town || "",
		phone: pharmacy.phone || "",
		email: pharmacy.email || "",
		latitude: pharmacy.latitude || "",
		longitude: pharmacy.longitude || "",
	}));

	// Used to disable buttons while saving to Firestore
	// prevents double-click saving - security, UX and usability..
	const [isSavingUpdate, setIsSavingUpdate] = useState(false);

	// Close the modal when the user presses Escape.
	// This is just to show I focused on usability a bit as well.
	useEffect(() => {
		function closeOnEscape(event) {
			if (event.key === "Escape") onClose();
		}

		window.addEventListener("keydown", closeOnEscape);

		// Cleanup so don't keep the event listener after the modal is closed
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [onClose]);

	// Updates the draft when the user types in any input.
	// I want tou se the input "name" to know which field to update.
	function updateDraftField(event) {
		const { name, value } = event.target;

		setPharmacyDraft((previousDraft) => ({
			...previousDraft,
			[name]: value,
		}));
	}

	// Save button will  update the pharmacy document in Firestore.
	// If it works, close the modal. If it fails, show an error.
	async function savePharmacyUpdate(event) {
		event.preventDefault(); // I learn about it as a kind of self-studies
		// Its prevent the default browser action like page refresh when normal form is submit.
		// I would like to handle the form submit with JavaScript instead.

		// Asks the user to confirm before saving changes this prevents accidental updates
		// and works like kid of confirmation of planned changes
		const userConfirmedSave = window.confirm(
			"Do you want to proceed with this changes?"
		);
		if (!userConfirmedSave) return;

		setIsSavingUpdate(true);

		try {
			// Reference to the pharmacy document we want to update
			const pharmacyDocRef = doc(firestoreDatabase, "pharmacies", pharmacy.id);

			// Update Firestore with the values from our local draft
			await updateDoc(pharmacyDocRef, pharmacyDraft);

			// Done close modal
			onClose();
		} catch (error) {
			alert("Unable to save changes. Please try again.");
		} finally {
			// Always re-enable buttons, even if something failed
			setIsSavingUpdate(false);
		}
	}

	return (
		// Overlay is the dark background behind the modal
		// Clicking it closes the modal (common UX pattern)
		<div className={styles.overlay} onClick={onClose}>
			{/* This is the actual modal box */}
			<div
				className={styles.modal}
				// Stop the click from reaching the overlay.
				// Without this, clicking inside the modal would also trigger the overlay click and close the modal.
				onClick={(event) => event.stopPropagation()} // this is usefull and I found this option by self-learning
				// It stops the click from reaching the overlay.
				// Without this, clicking inside the modal would also trigger the overlay click and close the modal.
			>
				<h2>Edit Pharmacy</h2>

				{/* Form submit calls savePharmacyUpdate */}
				<form onSubmit={savePharmacyUpdate} className={styles.form}>
					{/* Building the form inputs from the editableFields list */}
					{editableFields.map((field) => (
						<label key={field.name} className={styles.field}>
							<span className={styles.label}>{field.label}</span>

							{/* Controlled input. value comes from state and updates state on change */}
							<input
								name={field.name}
								value={pharmacyDraft[field.name]}
								onChange={updateDraftField}
								required
							/>
						</label>
					))}

					{/*--------------------------------------------------------------------------------- Buttons */}
					<div className={styles.actions}>
						{/* Disabled while saving so user can't spam the button */}
						<button type="submit" disabled={isSavingUpdate}>
							{isSavingUpdate ? "Saving..." : "Save changes"}
						</button>

						{/* Cancel just closes the modal without saving */}
						<button type="button" onClick={onClose} disabled={isSavingUpdate}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
