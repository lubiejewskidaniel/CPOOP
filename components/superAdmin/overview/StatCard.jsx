"use client";

import styles from "./SuperAdminOverviewClient.module.css";

// StatCard small UI box componenet for one statistic.
// I moved it to a separate file so my main overview page is shorter and easier to read.
// Props I use here:
// title - what I show at the top of the card
// isExpanded - if true, I show the extra details under the top row
// onToggle - runs when I click the card open or close
// childre - the extra content I want to show when expanded between <statCard></statCard>
export default function StatCard({
	title,
	value,
	isExpanded,
	onToggle,
	children,
}) {
	return (
		<div
			className={`${styles.card} ${isExpanded ? styles.cardExpanded : ""}`}
			onClick={onToggle}
			role="button"
			tabIndex={0}
		>
			<div className={styles.cardTop}>
				<strong>{title}</strong>
				<span className={styles.value}>{value}</span>
			</div>

			{/* Extra details only show when the card is expanded */}
			{isExpanded && <div className={styles.details}>{children}</div>}
		</div>
	);
}
