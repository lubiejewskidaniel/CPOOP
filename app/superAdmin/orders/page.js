// Super admin orders, server side route
// Renders the client-side orders screen.
import SuperAdminOrdersClient from "@/components/superAdmin/orders/SuperAdminOrdersClient";
import SuperAdminRoute from "@/components/auth/SuperAdminRoute";

export default function SuperAdminOrdersPage() {
	return (
		<SuperAdminRoute>
			<SuperAdminOrdersClient />;
		</SuperAdminRoute>
	);
}
