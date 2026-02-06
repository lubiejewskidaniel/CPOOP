// This section shows the cart total price and a button to clear the whole cart.
// If something happens, it can also show a short message under the button.
import styles from "./CartClient.module.css";

export default function CartSummary({
	totalPrice,
	onClearCart,
	feedbackMessage,
}) {
	return (
		<div className={styles.summary}>
			{/* Shows the total cost of all items in the cart */}
			<h3>Total: £{totalPrice.toFixed(2)}</h3>

			{/* Button that removes everything from the cart */}
			<button className={styles.clearBtn} onClick={onClearCart}>
				Clear cart
			</button>

			{/* Small message */}
			{feedbackMessage && (
				<div className={styles.feedback}>{feedbackMessage}</div>
			)}
		</div>
	);
}
