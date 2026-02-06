// Server route file
// This page only renders the main OrdersClient component.
// Whre I would like to keep logic and state of this part of app.
import OrdersClient from "@/components/orders/OrdersClient";

export default function OrdersPage() {
	return <OrdersClient />;
}
