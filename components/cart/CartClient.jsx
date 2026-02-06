// Cart page component - client-side because it uses state and context.
// Shows cart items, calculates total price, and manages checkout.
// Checkout is done with a Firestore transaction to avoid buying items that are out of stock.

"use client";

import { useMemo, useState } from "react";
import {
	collection,
	doc,
	runTransaction,
	serverTimestamp,
} from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthentication } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import CartList from "./CartList";
import CartSummary from "./CartSummary";
import CheckoutSection from "./CheckoutSection";
import styles from "./CartClient.module.css";

export default function CartClient() {
	const router = useRouter();
	const { authenticatedUser, isAuthenticationLoading } = useAuthentication();
	const { cartItems, clearCart } = useCart();

	// Small message appears after actions like clearing the cart
	const [feedbackMessage, setFeedbackMessage] = useState(null);

	// Total price is recalculated only when cartItems changes
	const totalPrice = useMemo(() => {
		return cartItems.reduce(
			(sum, item) => sum + item.price * item.cartQuantity,
			0,
		);
	}, [cartItems]);

	// Shows a small message and hides it after 2 seconds.
	function showFeedback(message) {
		setFeedbackMessage(message);
		setTimeout(() => setFeedbackMessage(null), 2000);
	}

	// Clears the cart after user confirmation and shows a short feedback message.
	function handleClearCart() {
		const confirmClear = window.confirm(
			"Are you sure you want to clear your cart?",
		);
		if (!confirmClear) return;

		clearCart();
		showFeedback("Cart cleared");
	}

	// Creates an order and updates product stock using a Firestore transaction
	async function handleCheckout() {
		// User must be logged in to place an order
		if (!authenticatedUser) {
			router.push("/loginOrRegister");
			return;
		}

		// This Firestore transaction handles checkout in a safe all or nothing way:
		// it first reads every product from the cart and checks if it still exists
		// and has enough stock, then it updates the stock quantities, and finally
		// creates a new order document. If any check fails, it throws an error and nothing is saved/updated.
		// If it succeeds, the cart is cleared and a success message is shown.
		try {
			await runTransaction(firestoreDatabase, async (transaction) => {
				// Read products and check stock for every cart item
				const productDocs = [];

				for (const item of cartItems) {
					const productRef = doc(firestoreDatabase, "products", item.productId);
					const productSnap = await transaction.get(productRef);

					if (!productSnap.exists()) {
						throw new Error(`Product ${item.productName} no longer exists`);
					}

					const productData = productSnap.data();

					if (productData.quantity < item.cartQuantity) {
						throw new Error(`Not enough stock for ${item.productName}`);
					}

					productDocs.push({
						ref: productRef,
						data: productData,
						cartItem: item,
					});
				}

				// Update stock quantities
				for (const product of productDocs) {
					transaction.update(product.ref, {
						quantity: product.data.quantity - product.cartItem.cartQuantity,
					});
				}

				// Creating the order document
				const orderRef = doc(collection(firestoreDatabase, "orders"));

				transaction.set(orderRef, {
					userId: authenticatedUser.uid,
					userDisplayName:
						authenticatedUser.displayName || authenticatedUser.email,
					createdAt: serverTimestamp(),
					status: "PLACED",
					totalPrice,
					items: cartItems.map((item) => ({
						productId: item.productId,
						productName: item.productName,
						pharmacyName: item.pharmacyName,
						quantity: item.cartQuantity,
						price: item.price,
					})),
				});
			});

			clearCart();
			alert("Order placed successfully!");
		} catch (error) {
			alert(error.message);
		}
	}

	// Wait until auth is loaded (so we know if user is logged in)
	if (isAuthenticationLoading) return <p>Loading...</p>;

	// Empty cart view
	if (!cartItems || cartItems.length === 0) {
		return (
			<div className={styles.page}>
				<h2>Your cart is empty</h2>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<h1>Your Cart</h1>

			{/* List of cart items */}
			<CartList cartItems={cartItems} />

			<hr className={styles.hr} />

			{/* Total price + clear cart button */}
			<CartSummary
				totalPrice={totalPrice}
				onClearCart={handleClearCart}
				feedbackMessage={feedbackMessage}
			/>

			<hr className={styles.hr} />

			{/* Checkout button or login  if user is not logged in */}
			<CheckoutSection
				authenticatedUser={authenticatedUser}
				onCheckout={handleCheckout}
				onLogin={() => router.push("/loginOrRegister")}
			/>
		</div>
	);
}
