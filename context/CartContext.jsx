"use client";

/*
The CartContext and CartProvider are used to manage the shopping cart also across whole app. 
They store cart items in react state, save the cart to localStorage, and restore it when the app reloads 
so the cart is not lost. They also provide functions to add, update, and remove items, which any component 
can use through a custom hook. This runs also on the client side because localStorage is a browser feature and it relies on hooks and context.
*/

import { createContext, useContext, useEffect, useState } from "react";

// Create cart context
const CartContext = createContext(null);

export function CartProvider({ children }) {
	// Initializing cart state from localStorage
	const [cartItems, setCartItems] = useState(() => {
		if (typeof window === "undefined") return [];
		const storedCart = localStorage.getItem("cart");
		return storedCart ? JSON.parse(storedCart) : [];
	});

	// Saving cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cartItems));
	}, [cartItems]);

	// Adding below product to cart
	function addProductToCart(product, quantityToAdd) {
		setCartItems((previousItems) => {
			// Check if product already exists in cart
			const existingItem = previousItems.find(
				(item) => item.productId === product.id
			);

			// Total stock available for this product
			const stockQuantity = product.quantity;

			// if product is already in cart
			if (existingItem) {
				// increasing quantity but not exceed stock
				const newQuantity = Math.min(
					existingItem.cartQuantity + quantityToAdd,
					existingItem.stockQuantity
				);

				// If quantity goes to zero or less, removes item
				if (newQuantity <= 0) {
					return previousItems.filter(
						(item) => item.cartItemId !== existingItem.cartItemId
					);
				}

				// Updates quantity for existing item
				return previousItems.map((item) =>
					item.cartItemId === existingItem.cartItemId
						? {
								...item,
								cartQuantity: newQuantity,
						  }
						: item
				);
			}

			// New product - not in cart yet
			return [
				...previousItems,
				{
					cartItemId: crypto.randomUUID(), // unique cart item ID
					// It is used to give each cart item its own unique ID, even if the same product is added multiple times.
					productId: product.id,
					productName: product.productName,
					pharmacyId: product.pharmacyId,
					pharmacyName: product.pharmacyName,
					price: product.price,
					stockQuantity,
					// Makes sure quantity does not exceed stock again
					cartQuantity: Math.min(quantityToAdd, stockQuantity),
				},
			];
		});
	}

	// increase quantity by 1
	function increaseCartItem(cartItemId) {
		setCartItems((previousItems) =>
			previousItems.map((item) =>
				item.cartItemId === cartItemId
					? {
							...item,
							cartQuantity: Math.min(item.cartQuantity + 1, item.stockQuantity),
					  }
					: item
			)
		);
	}

	// decrease by 1
	function decreaseCartItem(cartItemId) {
		setCartItems((previousItems) =>
			previousItems
				.map((item) =>
					item.cartItemId === cartItemId
						? {
								...item,
								cartQuantity: item.cartQuantity - 1,
						  }
						: item
				)
				// Removes item if quantity becomes 0
				.filter((item) => item.cartQuantity > 0)
		);
	}

	// removes products completly
	function removeProductFromCart(cartItemId) {
		setCartItems((previousItems) =>
			previousItems.filter((item) => item.cartItemId !== cartItemId)
		);
	}

	// clears entire cart
	function clearCart() {
		setCartItems([]);
		localStorage.removeItem("cart");
	}

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addProductToCart,
				increaseCartItem,
				decreaseCartItem,
				removeProductFromCart,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

// Another my custom hook this time to access cart context
export function useCart() {
	return useContext(CartContext);
}
