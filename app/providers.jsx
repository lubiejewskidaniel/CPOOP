// Client side wrapper for global react context providers.
// Keeps Auth and Cart state available for all pages in the application.
"use client";

import { AuthenticationProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }) {
	return (
		<AuthenticationProvider>
			<CartProvider>{children}</CartProvider>
		</AuthenticationProvider>
	);
}
