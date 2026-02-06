/*
The SharedMenuList component shows navigation links that are used by different user roles. 
It is reused in multiple sidebars to avoid repeating code and only focuses on displaying the menu.
*/

import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function SharedMenuList() {
	return (
		<ul className={styles.menu}>
			{/* Link to product search page */}
			<li>
				<Link href="/">Search Products</Link>
			</li>

			{/* Link to cart page */}
			<li>
				<Link href="/cart">My Cart</Link>
			</li>

			{/* Link to user's past orders */}
			<li>
				<Link href="/orders">My Past Orders</Link>
			</li>
		</ul>
	);
}
