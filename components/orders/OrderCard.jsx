// OrderCard is like on order tile shown in the orders list.
// This componenet is a Server Component
// I only render UI based on props.
// The click handler onToggle is passed from a parent Client Component so expand and collapse works.
//
// What this card does:
// shows a short summary line date, status, total
// when I click it, it can expand and show more details + list of products
// for the Super Admin page I can optionally show the user's name (showUserName = true)
import OrderItemsList from "./OrderItemsList";
import styles from "./OrdersClient.module.css";

export default function OrderCard({
	order,
	isExpanded,
	onToggle,
	showUserName = false, // default - normal users don't need the username
}) {
	// Convert Firestore timestamp to a normal JS Date so I can format it nicely
	const orderDate = order.createdAt?.toDate?.();

	// For safety reasons I make sure totalPrice is always a number so toFixed() doesn't crash
	const safeTotal = Number(order.totalPrice ?? 0);

	return (
		<div
			// If the card is expanded, I add an extra class for styling like different background
			className={`${styles.orderCard} ${
				isExpanded ? styles.orderCardExpanded : ""
			}`}
			// When I click the card, I call onToggle() from the parent it decides expanded or collapsed
			onClick={onToggle}
			// For accessibility I treats this div like a clickable element
			role="button"
			tabIndex={0}
		>
			{/* Summary line is always visible */}
			<div className={styles.orderSummary}>
				{/* Option to show the user name is only on the Super Admin page */}
				{showUserName && (
					<>
						<strong>User:</strong> {order.userDisplayName ?? "Unknown"}
						{" ➜ "}
					</>
				)}
				{/* Date, status,  total is the basic info I want to see quickly */}
				<strong>
					{orderDate ? orderDate.toLocaleDateString() : "No date"}
				</strong>
				{" - "}Status: {order.status}
				{" - "}Total: £{safeTotal.toFixed(2)}
			</div>

			{/* Expanded details only visible when isExpanded is true */}
			{isExpanded && (
				<div className={styles.orderDetails}>
					{/* Again show user in details if this is the Super Admin view */}
					{showUserName && (
						<div>
							<strong>User:</strong> {order.userDisplayName ?? "Unknown"}
						</div>
					)}

					{/* More detailed info */}
					<div>
						<strong>Date & time:</strong>{" "}
						{orderDate ? orderDate.toLocaleString() : "No timestamp"}
					</div>

					<div>
						<strong>Status:</strong> {order.status}
					</div>

					<div>
						<strong>Total:</strong> £{safeTotal.toFixed(2)}
					</div>

					{/* Products in this order are in separate component to keep this file cleaner */}
					<div className={styles.itemsBlock}>
						<strong>Products:</strong>
						{/* If order.items is missing, I pass empty array [] so the list component doesn't crash on .map() */}
						<OrderItemsList items={order.items ?? []} />
					</div>
				</div>
			)}
		</div>
	);
}
