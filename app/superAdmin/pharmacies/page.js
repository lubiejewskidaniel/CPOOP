// Server route file.
//It is render the client component with Firestore logic.
import SuperAdminPharmaciesClient from "@/components/superAdmin/pharmacies/SuperAdminPharmaciesClient";
import SuperAdminRoute from "@/components/auth/SuperAdminRoute";

export default function SuperAdminPharmaciesPage() {
	return (
		<SuperAdminRoute>
			{/* Guard that blocks non-super-admin users */}
			<SuperAdminPharmaciesClient />
		</SuperAdminRoute>
	);
}
