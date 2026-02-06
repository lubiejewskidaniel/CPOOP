//  Server route file.
// I keep the route file minimal and render the SuperAdminProductsClient component.
// actually I want to keep same strusture for all routes, but will add some comments anyway for aech to keep consistency.
import SuperAdminProductsClient from "@/components/superAdmin/products/SuperAdminProductsClient";
import SuperAdminRoute from "@/components/auth/SuperAdminRoute";

export default function SuperAdminProductsPage() {
	return (
		<SuperAdminRoute>
			{/* Guard that blocks non-super-admin users */}
			<SuperAdminProductsClient />;
		</SuperAdminRoute>
	);
}
