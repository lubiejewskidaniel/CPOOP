// This controls what the user sees at the bottom of the cart.
// If the user is logged in, it shows the checkout button.
// If the user is not logged in, it shows a button that sends them to the login page.
import styles from "./CartClient.module.css";

export default function CheckoutSection({
	authenticatedUser,
	onCheckout,
	onLogin,
}) {
	// Logged in - allow the user to place the order
	if (authenticatedUser) {
		return (
			<button className={styles.checkoutBtn} onClick={onCheckout}>
				Proceed to checkout
			</button>
		);
	}

	// Not logged in - ask the user to log in first
	return (
		<button className={styles.loginCta} onClick={onLogin}>
			Log in to check out
		</button>
	);
}
