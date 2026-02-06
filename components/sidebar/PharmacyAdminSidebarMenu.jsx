/*
  This component renders the sidebar menu
  for pharmacy admin users.
	Shows shared menu items (used in other sidebars)
  	Displays admin-specific links
   	Uses Next.js Link for client-side navigation
  This is a basically presentational component.
*/

import Link from "next/link";
import styles from "./Sidebar.module.css";
import SharedMenuList from "./SharedMenuList";

export default function PharmacyAdminSidebarMenu() {
	return (
		<>
			{/* Shared menu items */}
			<SharedMenuList />

			<hr />
			<br />

			{/* Pharmacy admin specific menu */}
			<ul className={styles.menu}>
				<li>
					<Link href="/pharmacies">Manage Pharmacies</Link>
				</li>

				<li>
					<Link href="/products">Manage Products</Link>
				</li>
			</ul>
		</>
	);
}
