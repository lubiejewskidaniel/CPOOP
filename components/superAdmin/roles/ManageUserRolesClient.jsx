"use client";

// Again I use this component as clinet side
// What I do here is loading all users and show them in a table, want to reuse <UserRow /> for each user.
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { useAuthentication } from "@/context/AuthContext";
import UserRow from "@/components/admin/UserRow";
import styles from "./ManageUserRolesClient.module.css";

export default function ManageUserRolesClient() {
	// I only need the role here to block the screen for non-super-admin users.
	const { userRole: currentUserRole } = useAuthentication();

	const [loadedUsers, setLoadedUsers] = useState([]);

	const [isUsersLoading, setIsUsersLoading] = useState(true);
	const [loadProblemMessage, setLoadProblemMessage] = useState(null);

	useEffect(() => {
		async function loadAllUsersFromFirestore() {
			setLoadProblemMessage(null);

			try {
				// Reading all user documents.
				const usersSnapshot = await getDocs(
					collection(firestoreDatabase, "users")
				);

				// Convert Firestore docs to objects and also keeps doc id for react key.
				const mappedUsers = usersSnapshot.docs.map((docSnap) => ({
					id: docSnap.id,
					...docSnap.data(),
				}));

				setLoadedUsers(mappedUsers);
			} catch (error) {
				setLoadProblemMessage("Could not load users. Please try again.");
			} finally {
				// Stops loading, as in other component exactly same logic.
				setIsUsersLoading(false);
			}
		}

		loadAllUsersFromFirestore();
	}, [currentUserRole]);

	// Another front-end UI guard. If not super admin, blocks the page.
	if (currentUserRole !== "SUPER_ADMIN") {
		return (
			<div className={styles.page}>
				<h2 className={styles.denied}>Sorry - Access denied!</h2>
			</div>
		);
	}

	if (isUsersLoading) return <p>Loading users...</p>;
	if (loadProblemMessage)
		return <p className={styles.error}>{loadProblemMessage}</p>;

	return (
		<div className={styles.page}>
			<h1 className={styles.title}>Manage User Roles</h1>

			<div className={styles.tableWrap}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Email</th>
							<th>Name</th>
							<th>Role</th>
						</tr>
					</thead>

					<tbody>
						{/* I reuse UserRow so the role changing logic can stay inside it */}
						{loadedUsers.map((user) => (
							<UserRow key={user.id} user={user} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
