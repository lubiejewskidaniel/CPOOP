// Server route file.
// This page is kept simple and only renders the main CartClient component
// where the cart UI and checkout logic are coded.
import CartClient from "@/components/cart/CartClient";

export default function CartPage() {
	return <CartClient />;
}
