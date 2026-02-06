// Root layout for my whole  app.
// Sets global metadata and wraps the UI with global providers and the main app shell.

import "./globals.css";
import Providers from "./providers";
import AppShell from "@/components/layout/AppShell";

// This metadata object is basically my page info for Next.js.
// Next uses it to fill the <head> section automatically
// (things like the browser tab title, the short description for Google, and rules for search engines).
// I also put the app name, author/creator, and a few keywords here so the project looks more complete and easier to identify.
export const metadata = {
	applicationName: "CPOOP",
	title: "Community Pharmacies Online Ordering Platform",
	description: "CPOOP - Online pharmacy ordering system",
	type: "website",
	authors: [{ name: "Daniel Lubiejewski" }],
	keywords: [
		"pharmacy",
		"online ordering",
		"community pharmacy",
		"medications",
		"health products",
		"prescriptions",
	],
	creator: "Daniel Lubiejewski",
	robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<AppShell>{children}</AppShell>
				</Providers>
			</body>
		</html>
	);
}
