"use client";
// Client component.
// PharmacyList shows pharmacies that belong to the currently logged-in user pharmacy admin.
// It uses a Firestore live listener onSnapshot (it is what I self-learnet by reading next and firebase documenattion),
// so the list updates automatically when a pharmacy is added, edited, deleted in the database no manual refresh is  needed.
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { useAuthentication } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import PharmacyItem from "./PharmacyItem";

export default function PharmacyList() {
	// Get the logged-in user from the Auth context (I need the uid for filtering)
	const { authenticatedUser } = useAuthentication();

	// Stores pharmacies owned by this user
	const [ownedPharmacies, setOwnedPharmacies] = useState([]);

	useEffect(() => {
		// Wait until have a logged-in user.
		// Without this check, authenticatedUser.uid could crash if user is still loading.
		if (!authenticatedUser) return;

		// Creating Firestore query - "pharmacies" collection, but only documents where ownerId = current user id
		const pharmaciesOwnedByUserQuery = query(
			collection(firestoreDatabase, "pharmacies"),
			where("ownerId", "==", authenticatedUser.uid)
		);

		// Start listening for live updates from Firestore.
		// Whenever data changes, snapshot gives us the newest list of documents.
		const unsubscribe = onSnapshot(pharmaciesOwnedByUserQuery, (snapshot) => {
			// Convert Firestore documents into normal JS objects
			// (I have to  add doc.id because Firestore data() does not include the id)
			setOwnedPharmacies(
				snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			);
		});

		// stop listening when component unmounts or when user changes
		return () => unsubscribe();
	}, [authenticatedUser]);

	// If user is not logged in, showing message instead of the list
	if (!authenticatedUser) return <p>Please log in.</p>;

	// an message when logged in, but no pharmacies found for this user
	if (ownedPharmacies.length === 0) return <p>No pharmacies found.</p>;

	return (
		<div>
			{/* Renders one PharmacyItem component for each pharmacy */}
			{ownedPharmacies.map((pharmacy) => (
				<PharmacyItem key={pharmacy.id} pharmacy={pharmacy} />
			))}
		</div>
	);
}
