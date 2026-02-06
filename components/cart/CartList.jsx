// This component shows the full list of items in the cart.
// It loops through the cart items and displays each one using the CartItem component.
import CartItem from "@/components/cart/CartItem";
import styles from "./CartClient.module.css";

export default function CartList({ cartItems }) {
	return (
		<div className={styles.list}>
			{cartItems.map((item) => (
				<CartItem key={item.cartItemId} item={item} />
			))}
		</div>
	);
}
