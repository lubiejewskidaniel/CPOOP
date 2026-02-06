/*
  This component renders the sidebar menu
  for super admin users!
  - Shows shared menu items (common links)
  - Displays super admin specific navigation options
  - Uses Link for client-side navigation
*/

import Link from "next/link";
import styles from "./Sidebar.module.css";
import SharedMenuList from "./SharedMenuList";

export default function SuperAdminSidebarMenu() {
	return (
		<>
			{/* Shared menu items used by all users */}
			<SharedMenuList />

			<hr />
			<br />

			{/* Super admin specific menu */}
			<ul className={styles.menu}>
				<li>
					<Link href="/superAdmin/overview">System Overview</Link>
				</li>

				<li>
					<Link href="/superAdmin/pharmacies">All Pharmacies</Link>
				</li>

				<li>
					<Link href="/superAdmin/products">All Products</Link>
				</li>

				<li>
					<Link href="/superAdmin/orders">All Orders</Link>
				</li>

				<li>
					<Link href="/superAdmin/roles">Manage User Roles</Link>
				</li>
			</ul>
		</>
	);
}
