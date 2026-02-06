"use client";
// Client component
// Form for adding a new pharmacy.
// User types data, clicks Add, then save it in Firestore and then form is hidden.
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { useAuthentication } from "@/context/AuthContext";
import styles from "./PharmacyForm.module.css";

// List of inputs for the form (so again I don't repeat the same input code many times
const pharmacyFields = [
	{ name: "name", placeholder: "Pharmacy Name" },
	{ name: "addressLine1", placeholder: "Address Line 1" },
	{ name: "postCode", placeholder: "Post Code" },
	{ name: "town", placeholder: "Town" },
	{ name: "phone", placeholder: "Phone" },
	{ name: "email", placeholder: "Email" },
	{ name: "latitude", placeholder: "Latitude" },
	{ name: "longitude", placeholder: "Longitude" },
];

export default function PharmacyForm({ onCancel }) {
	// Need user id to save who owns this pharmacy
	const { authenticatedUser } = useAuthentication();

	// Draft data for the new pharmacy, inputs update this object
	const [newPharmacyDraft, setNewPharmacyDraft] = useState({
		name: "",
		addressLine1: "",
		postCode: "",
		town: "",
		phone: "",
		email: "",
		latitude: "",
		longitude: "",
	});

	// Used for simple UX I mean disable buttons while saving + show an error message if needed
	const [isSavingNewPharmacy, setIsSavingNewPharmacy] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	// Updates the correct field based on input "name"
	function updateDraftField(event) {
		const { name, value } = event.target;

		setNewPharmacyDraft((previousDraft) => ({
			...previousDraft,
			[name]: value,
		}));
	}

	// Runs when the user clicks Add
	async function createPharmacy(event) {
		event.preventDefault(); // stop normal form refresh
		setErrorMessage(null);

		// Just in case page will be protected anywa/y
		if (!authenticatedUser) {
			setErrorMessage("You must be logged in to add a pharmacy.");
			return;
		}

		setIsSavingNewPharmacy(true);

		try {
			// Add a new document to pharmacies collection
			// ownerId links it to the logged-in admin
			await addDoc(collection(firestoreDatabase, "pharmacies"), {
				...newPharmacyDraft,
				ownerId: authenticatedUser.uid,
				createdAt: serverTimestamp(),
			});

			// After success, close the form (parent hides it)
			onCancel();
		} catch (error) {
			setErrorMessage("Error while added pharmacy. Please try again.");
		} finally {
			// Always turn off loading state (
			// even if it failed
			setIsSavingNewPharmacy(false);
		}
	}

	return (
		<form onSubmit={createPharmacy} className={styles.form}>
			{/* Create inputs from the array above */}
			{pharmacyFields.map((field) => (
				<input
					key={field.name}
					name={field.name}
					placeholder={field.placeholder}
					value={newPharmacyDraft[field.name]}
					onChange={updateDraftField}
					required
				/>
			))}

			{/* If something goes wrong, sho message */}
			{errorMessage && <p className={styles.error}>{errorMessage}</p>}

			{/* Buttons */}
			<div className={styles.actions}>
				{/* Disabled while saving so user can't click twice */}
				<button type="submit" disabled={isSavingNewPharmacy}>
					{isSavingNewPharmacy ? "Adding..." : "Add"}
				</button>

				{/* Cancel just hides the form */}
				<button type="button" onClick={onCancel} disabled={isSavingNewPharmacy}>
					Cancel
				</button>
			</div>
		</form>
	);
}
