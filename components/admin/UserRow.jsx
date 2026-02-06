"use client";

// Client Component as using useState to control the dropdown. Hooks works only in client components.
// UserRow is a one row in the Manage roles table.
// I want to show basic user informations and let Super Admin change the user's role.
// So user picks a role then I save it to Firestore and show  "Saving..." feedback.
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";

export default function UserRow({ user }) {
	// I keep the currently selected role here - so the dropdown is controlled.
	const [selectedRole, setSelectedRole] = useState(user.role);

	// Blocks the dropdown while saving what prevents multi clicks.
	const [isRoleSavingNow, setIsRoleSavingNow] = useState(false);

	// Message for user with success or error.
	const [statusNote, setStatusNote] = useState(null);

	// Runs when I pick a different role in the dropdown.
	async function saveNewRoleToDatabase(nextRole) {
		// Remember the old role in case we need to rollback.
		const previousRole = selectedRole;

		// Update UI instantly, but I will rollback if Firestore fails.
		setSelectedRole(nextRole);
		setIsRoleSavingNow(true);
		setStatusNote(null);

		try {
			// Reference to this user's document in Firestore.
			const userDocRef = doc(firestoreDatabase, "users", user.id);

			// Save the new role in the database.
			await updateDoc(userDocRef, { role: nextRole });

			// Feedback so user knows it worked.
			setStatusNote("Saved correctly");
			setTimeout(() => setStatusNote(null), 1500);
		} catch (error) {
			// If saving failed, I rollback the UI so it matches the database again.
			setSelectedRole(previousRole);

			// Tell the user what happened in case of error.
			setStatusNote("We are sorry: Save failed");
		} finally {
			// Always unlock the dropdown at the end.
			setIsRoleSavingNow(false);
		}
	}

	return (
		<tr style={{ opacity: isRoleSavingNow ? 0.7 : 1 }}>
			<td>{user.email}</td>
			<td>{user.displayName ?? "-"}</td>

			{/* Role dropdown */}
			<td>
				<div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
					<select
						value={selectedRole}
						disabled={isRoleSavingNow}
						onChange={(e) => saveNewRoleToDatabase(e.target.value)}
					>
						<option value="USER">USER</option>
						<option value="PHARMACY_ADMIN">PHARMACY_ADMIN</option>
						<option value="SUPER_ADMIN">SUPER_ADMIN</option>
					</select>

					{/* Feedback text next to the dropdown */}
					{isRoleSavingNow && (
						<span style={{ fontSize: "0.85rem" }}>Saving…</span>
					)}
					{!isRoleSavingNow && statusNote && (
						<span style={{ fontSize: "0.85rem" }}>{statusNote}</span>
					)}
				</div>
			</td>
		</tr>
	);
}
