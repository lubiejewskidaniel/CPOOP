"use client";

/*
  PharmacyMarkerPopup Component
  This component is shown inside a leaflet map popup.
  Displays pharmacy details (name, address, contact)
  Shows a list of products for that pharmacy
  Allows the user to choose quantity per product
  llows adding products to the cart
  This is client component because it again uses react state and handles user interactions like inputs or buttons.
*/

import { useState } from "react";
import styles from "./PharmacyMarkerPopup.module.css";

export default function PharmacyMarkerPopup({
	pharmacy,
	products = [],
	onAddToCart,
}) {
	/*
	  Local state to store selected quantity per product.
	  I will use an object where key = productId and value = selected quantity
	*/
	const [selectedQuantities, setSelectedQuantities] = useState({});

	/*
	  Handle quantity input change, of course i have to make sure value is a number, revent going below 1
	 and going above available stock
	*/
	function handleQuantityChange(productId, value, maxAvailable) {
		const safeQuantity = Math.max(1, Math.min(Number(value), maxAvailable));

		setSelectedQuantities((prev) => ({
			...prev,
			[productId]: safeQuantity,
		}));
	}

	// The rest of code is pretty simple
	return (
		<div className={styles.popup}>
			{/* name of pharmacy */}
			<h3 className={styles.name}>{pharmacy.name}</h3>

			{/* Pharmacy address */}
			<p className={styles.address}>
				{pharmacy.addressLine1}
				<br />
				{pharmacy.postCode}, {pharmacy.town}
			</p>

			{/* Contact informations for each */}
			<p className={styles.meta}>
				📞 {pharmacy.phone}
				<br />
				📧 {pharmacy.email}
			</p>

			<hr />

			{/* If there are no products, message will show message */}
			{products.length === 0 ? (
				<p className={styles.noProducts}>No products available</p>
			) : (
				/* Products */
				<ul className={styles.productList}>
					{products.map((product) => {
						// Available quantity (already adjusted by cart if needed)
						const availableQuantity = product.available ?? product.quantity;

						// Selected quantity by defoult i setup to 1
						const selectedQty = selectedQuantities[product.id] ?? 1;

						return (
							<li key={product.id} className={styles.productRow}>
								{/* Details of product */}
								<div className={styles.productInfo}>
									<strong>{product.productName}</strong>
									<div>Category: {product.category}</div>
									<div>Price: £{product.price}</div>
									<div>Available: {availableQuantity}</div>
								</div>

								{/* Quantity input nad add button */}
								<div className={styles.actions}>
									<input
										type="number"
										min="1"
										max={availableQuantity}
										value={selectedQty}
										onChange={(e) =>
											handleQuantityChange(
												product.id,
												e.target.value,
												availableQuantity
											)
										}
										className={styles.qtyInput}
									/>

									<button
										className={styles.addButton}
										disabled={availableQuantity === 0}
										onClick={() => onAddToCart(product, selectedQty)}
									>
										Add to Cart
									</button>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
