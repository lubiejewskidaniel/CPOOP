// This component shows one product inside the shopping cart.
// It displays the name, price, and current quantity, and lets the user add, reduce, or remove the item.
// After each action it shows a short message for a 2 seconds.
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./CartItem.module.css";

export default function CartItem({ item }) {
	// Functions from the cart system increase decrease remove)
	const { increaseCartItem, decreaseCartItem, removeProductFromCart } =
		useCart();

	// Small message shown under the item after clicking a button
	const [feedbackMessage, setFeedbackMessage] = useState(null);

	// Shows a short message and hides it after 2 seconds
	function showFeedback(message) {
		setFeedbackMessage(message);
		setTimeout(() => setFeedbackMessage(null), 2000);
	}

	// + button - adds one more of the product
	function handleIncrease() {
		increaseCartItem(item.cartItemId);
		showFeedback("Quantity increased");
	}

	// - button - reduces quantity and removes the product if it reaches 0
	function handleDecrease() {
		decreaseCartItem(item.cartItemId);
		showFeedback(
			item.cartQuantity === 1
				? "Product removed from cart"
				: "Quantity decreased"
		);
	}

	// Remove button - removes the product completely
	function handleRemove() {
		removeProductFromCart(item.cartItemId);
		showFeedback("Product removed from cart");
	}

	return (
		<div className={styles.item}>
			{/* Basic product info */}
			<strong className={styles.title}>{item.productName}</strong>
			<div className={styles.meta}>Price: £{item.price}</div>
			<div className={styles.meta}>Quantity: {item.cartQuantity}</div>

			{/* Buttons to change quantity */}
			<div className={styles.actions}>
				<button className={styles.qtyBtn} onClick={handleDecrease}>
					-
				</button>
				<button className={styles.qtyBtn} onClick={handleIncrease}>
					+
				</button>
				<button className={styles.removeBtn} onClick={handleRemove}>
					Remove
				</button>
			</div>

			{/* Short message fou better UI */}
			{feedbackMessage && (
				<div className={styles.feedback}>{feedbackMessage}</div>
			)}
		</div>
	);
}
