"use client";

// Header is client component because I use react hooks and Context (useCart, useAuthentication).
// This header is always on top of the page:
// top side is logo if clicked goes home.
// bottom side is navigation icons (home / account / cart)
// Extra thing is laso I mean I show how many items are in the cart - badge on the cart icon.

import Link from "next/link";
import Image from "next/image";
import IconLink from "./IconLink";
import styles from "./Header.module.css";

// I read auth and cart state from my Contexts this is stored in the browser
import { useAuthentication } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
	// From CartContext I take the current cart items
	const { cartItems } = useCart();

	// From AuthContext I take the logged-in user, null if not logged in
	const { authenticatedUser } = useAuthentication();

	// I calculate total quantity in cart, like: 2x paracetamol + 1x vitamins = 3 items total
	// BUT: right now I don't use it in JSX, but it's useful if I want the badge to show total quantity
	// instead of just how many different products. I impove it later for now is showing how many poisitins I have in a cart.
	const totalItemsInCart = cartItems.reduce(
		(sum, item) => sum + item.cartQuantity,
		0,
	);

	return (
		<header className={styles.header}>
			{/* Logo Area 
				I wrap the logo in <Link> so clicking it takes me back to the homepage. */}
			<Link href="/" className={styles.logo}>
				<Image
					src="/navBar/logo_v1.png"
					alt="CPOOP Home"
					title="Home"
					width={90}
					height={90}
					priority // I want the logo to load fast because it’s always visible
				/>
			</Link>

			{/* Navigation Icons
				This is the right side of the header. Each IconLink is basically a button link */}
			<nav className={styles.nav} aria-label="Main navigation">
				{/* Home icon, just goes to "/" */}
				<IconLink
					href="/"
					icon="/navBar/home.png"
					label="Home"
					tooltip="Go to Home Page"
				/>

				{/* Account icon goes to loginOrRegister page.
					I disable it when user is already logged in, because it doesn't make sense to show login again. */}
				<IconLink
					href="/loginOrRegister"
					icon="/navBar/account.png"
					label="Account"
					tooltip="Login / Register to your Account"
					disabled={Boolean(authenticatedUser)} // true if user exists, false if null
				/>

				{/* Cart icon,  goes to "/cart".
					The badgeCount shows how many items are in the cart.
					Right now it uses cartItems.length - how many different products.
					If I wanted total quantity, I could use badgeCount={totalItemsInCart} i suppose. */}
				<IconLink
					href="/cart"
					icon="/navBar/cart.png"
					label="Cart"
					badgeCount={cartItems.length}
					tooltip="Cart"
				/>
				{/* Featured icon,  goes to "/featured".
					It was last funcionality added to sow server side actions. */}
				<IconLink
					href="/featured"
					icon="/navBar/featured.png"
					label="Featured"
					tooltip="Featured products"
				/>
			</nav>
		</header>
	);
}
