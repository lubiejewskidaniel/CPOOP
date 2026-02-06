// OrdersList displays all orders on the page - server component
// It loops through the orders array and renders one OrderCard for each order.
// The parent component controls which order is expanded - expandedOrderId, and I just pass that info down.
import OrderCard from "./OrderCard";
import styles from "./OrdersClient.module.css";

export default function OrdersList({ orders, expandedOrderId, onToggleOrder }) {
	return (
		<div className={styles.list}>
			{/* Creates one card per order */}
			{orders.map((order) => (
				<OrderCard
					// this is done becouse react needs a unique key for lists
					key={order.id}
					// Full order data like date, status nad so on
					order={order}
					// True only for the currently opened order
					isExpanded={expandedOrderId === order.id}
					// When card is clicked, tells to  parent which order to open or close
					onToggle={() => onToggleOrder(order.id)}
				/>
			))}
		</div>
	);
}
