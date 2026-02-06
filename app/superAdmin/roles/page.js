// Server route file.
// I keep it clean: it only renders the client component with the real logic.
import ManageUserRolesClient from "@/components/superAdmin/roles/ManageUserRolesClient";
import SuperAdminRoute from "@/components/auth/SuperAdminRoute";

export default function ManageUserRolesPage() {
	return (
		<SuperAdminRoute>
			<ManageUserRolesClient />;
		</SuperAdminRoute>
	);
}
