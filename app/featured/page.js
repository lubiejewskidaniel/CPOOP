import { getFeaturedProductsAction } from "@/app/actions/featuredActions";
import FeaturedClient from "@/components/featured/FeaturedClient";

//  Server component page: fetches featured products on the server
// and passes them to the client component as initial data.
export default async function FeaturedPage() {
	const initialProducts = await getFeaturedProductsAction();
	return <FeaturedClient initialProducts={initialProducts} />;
}
