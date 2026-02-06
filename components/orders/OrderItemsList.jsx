// OrderItemsList is to list of products inside a single order. - Server component.
// It receives an array of items from Firestore and prints basic info for each product.
// This is used inside the expanded order view so user can see what bought.
import styles from "./OrdersClient.module.css";

export default function OrderItemsList({ items }) {
	return (
		<ul className={styles.itemsList}>
			{/* Loops through all products in the order */}
			{items.map((item, index) => (
				<li
					// Using index as key should be fine  here because order items usually do not change
					key={index}
					className={styles.itemRow}
				>
					{/* Pharmacy that sold the product */}
					<div>
						<strong>Pharmacy Name:</strong> {item.pharmacyName}
					</div>

					{/* Product details */}
					<div>Product: {item.productName}</div>
					<div>Quantity: {item.quantity}</div>

					{/* Makes sure price is a number and always show 2 decimals */}
					<div>Price: £{Number(item.price ?? 0).toFixed(2)}</div>
				</li>
			))}
		</ul>
	);
}
