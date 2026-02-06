import SuperAdminOverviewClient from "@/components/superAdmin/overview/SuperAdminOverviewClient";
import SuperAdminRoute from "@/components/auth/SuperAdminRoute";

// This is a SERVER route file (no "use client").
// It only wraps the client UI with a guard component.
export default function SuperAdminOverviewPage() {
	return (
		<SuperAdminRoute>
			{/* Guard that blocks non-super-admin users */}
			<SuperAdminOverviewClient />
		</SuperAdminRoute>
	);
}
