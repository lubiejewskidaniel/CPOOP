"use client";
// as per above another client component as I use por example useEffect.
// IconLink = one icon in the header like Home, Account, Cart
// It can be clickable Link or disabled just shows, but you can't click

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function IconLink({
	href, // where to go after click
	icon, // icon image path
	label, // text under icon
	tooltip, // small text shown on hover
	badgeCount = 0, // optional number next to label, fo example Cart (2)
	disabled = false, // if true - not clickable
}) {
	// I use this only to avoid react hydration issues with the badge number
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// runs once in the browser
		setIsMounted(true);
	}, []);

	// The same UI for both cases clickable and disabled
	const content = (
		<div
			className={`${styles.iconWrapper} ${disabled ? styles.iconDisabled : ""}`}
		>
			<Image
				src={icon}
				alt={label}
				width={30}
				height={30}
				className={styles.iconImage}
			/>

			<span className={styles.label}>
				{label}
				{/* show badge only after mount and only if > 0 */}
				{isMounted && badgeCount > 0 ? ` (${badgeCount})` : ""}
			</span>

			{/* tooltip only when clickable */}
			{!disabled && <span className={styles.tooltip}>{tooltip}</span>}
		</div>
	);

	// If disabled, I return the UI without <Link> so it cannot be clicked
	if (disabled) return content;

	// Normal case is wraping in <Link> so it navigates
	return (
		<Link href={href} className={styles.iconLink}>
			{content}
		</Link>
	);
}
