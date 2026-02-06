"use client";

/*
The ProductCard component displays a single product with its name, pharmacy, category, 
and price, calculates remaining availability, lets users choose a quantity, 
add the item to the cart, and shows brief feedback after adding. 
It is a client component because it uses again react state, CartContext, and also handles user interactions.
*/

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import styles from "./Search.module.css";

export default function ProductCard({ product }) {
	// Gets cart data and addtocart function from context
	const { addProductToCart, cartItems } = useCart();

	// State for selected quantity input
	const [selectedQuantity, setSelectedQuantity] = useState(1);

	// State for showing feedback message after adding to cart
	const [feedbackMessage, setFeedbackMessage] = useState(null);

	/*
	  Find this product in cart if it already exists
	  This helps us calculate remaining available quantity
	*/
	const cartItemForThisProduct = cartItems.find(
		(item) => item.productId === product.id
	);

	/*
	  Calculate available quantity
	  = total quantity - quantity already in cart
	*/
	const availableQuantity =
		product.quantity - (cartItemForThisProduct?.cartQuantity ?? 0);

	/*
	  Handle add to cart button click
	*/
	function handleAddToCart() {
		// Add product with selected quantity
		addProductToCart(product, selectedQuantity);

		// Reset quantity input back to 1
		setSelectedQuantity(1);

		// Show feedback message
		setFeedbackMessage("Product added to cart");

		// Hide feedback message after 2 seconds
		setTimeout(() => {
			setFeedbackMessage(null);
		}, 2000);
	}

	return (
		<div className={styles.productCard}>
			<span className={styles.productName}>{product.productName}</span>

			<span className={styles.productMeta}>
				Pharmacy: {product.pharmacyName}
			</span>

			<span className={styles.productMeta}>Category: {product.category}</span>

			<span className={styles.productMeta}>Price: £{product.price}</span>

			<span className={styles.productMeta}>Available: {availableQuantity}</span>

			{/* Quantity input and button */}
			<div className={styles.quantityRow}>
				<input
					type="number"
					min="1"
					max={availableQuantity}
					value={selectedQuantity}
					onChange={(event) =>
						// Making sure quantity stays between 1 and available stock
						setSelectedQuantity(
							Math.min(
								availableQuantity,
								Math.max(1, Number(event.target.value))
							)
						)
					}
					className={styles.quantityInput}
				/>

				<button
					className={styles.button}
					onClick={handleAddToCart}
					disabled={availableQuantity === 0}
				>
					{/* Change button text when out of stock */}
					{availableQuantity === 0 ? "Out of stock" : "Add to cart"}
				</button>

				{/* Show feedback message after adding to cart */}
				{feedbackMessage && (
					<span className={styles.feedbackMessage}>{feedbackMessage}</span>
				)}
			</div>
		</div>
	);
}
