// Main page structure layout shell used across the app.
// Renders the Header, Sidebar, and the main content area where pages are displayed.
// Server component

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./AppShell.module.css";

export default function AppShell({ children }) {
	return (
		<>
			<Header />
			<div className={styles.shell}>
				<Sidebar />
				<main className={styles.main}>{children}</main>
			</div>
		</>
	);
}
