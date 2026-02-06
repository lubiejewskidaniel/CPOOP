"use client";

/*
  PharmaciesMap Component

  This component:
  - Fetches pharmacies from Firebase Firestore
  - Shows them on a Leaflet map
  - Loads products for each pharmacy
  - Displays a popup with pharmacy info and products
  - Allows adding products to the cart from the popup

  This is a client component because it uses browser APIs (Leaflet) and it uses React hooks 
*/

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { createRoot } from "react-dom/client";
import PharmacyMarkerPopup from "./PharmacyMarkerPopup";
import { useCart } from "@/context/CartContext";
import "leaflet/dist/leaflet.css";

export default function PharmaciesMap() {
	// State to store all pharmacies fetched from Firestore
	const [pharmacies, setPharmacies] = useState([]);

	// Cart context values
	const { cartItems, addProductToCart } = useCart();

	/*
	  Loading pharmacies once when component will be mounted. I used mount becose have troubles with code,
	  and I found informations this is one of the easiest way.
	*/
	useEffect(() => {
		async function fetchPharmacies() {
			// Gets all documents from pharmacies collection
			const pharmaciesSnapshot = await getDocs(
				collection(firestoreDatabase, "pharmacies")
			);

			// Convertin again Firestore documents to normal JS objects
			const pharmaciesData = pharmaciesSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPharmacies(pharmaciesData);
		}

		fetchPharmacies();
	}, []);

	/*
	  finally initialize Leaflet map when pharmacies are loaded
	  and re-runs if cart items change (to update available quantity) - it was tricky also to keep
	  app working with no errors in my layout.
	*/
	useEffect(() => {
		// Do nothing if pharmacies are not loaded yet
		if (!pharmacies.length) return;

		let leafletMap;

		async function initializeMap() {
			// Dynamically import Leaflet s it is important per Next requirements
			const L = (await import("leaflet")).default;

			// Fixing Leaflet marker icon paths as it was another issues - per my self studies
			// I found the way to display markers and icons by coping graphics directly to my static files in public/leaflet folder.
			delete L.Icon.Default.prototype._getIconUrl;
			L.Icon.Default.mergeOptions({
				iconRetinaUrl: "/leaflet/marker-icon-2x.png",
				iconUrl: "/leaflet/marker-icon.png",
				shadowUrl: "/leaflet/marker-shadow.png",
			});

			// Creates map and set default view  what logically i set up to roughly full UK view.
			leafletMap = L.map("pharmacies-map").setView([54.5, -3], 6);

			// Add OpenStreetMap tiles
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: "© OpenStreetMap contributors",
			}).addTo(leafletMap);

			// Loop through all pharmacies
			for (const pharmacy of pharmacies) {
				const latitude = Number(pharmacy.latitude);
				const longitude = Number(pharmacy.longitude);

				// Skiping pharmacy if coordinates are invalid
				if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;

				/*
				  Load products for this pharmacy collection
				*/
				const productsSnapshot = await getDocs(
					query(
						collection(firestoreDatabase, "products"),
						where("pharmacyId", "==", pharmacy.id)
					)
				);

				// Preparing products data and calculate available quantity
				const products = productsSnapshot.docs.map((doc) => {
					const productData = doc.data();

					// Here I checking if product is already in cart
					const cartItem = cartItems.find((item) => item.productId === doc.id);

					return {
						id: doc.id,
						...productData,
						// Available quantity = total - quantity already in cart what is pretty obvious
						available: productData.quantity - (cartItem?.cartQuantity ?? 0),
					};
				});

				// Here marker is creted on the map
				const marker = L.marker([latitude, longitude]).addTo(leafletMap);

				// And container for react popup
				const popupContainer = document.createElement("div");
				const popupRoot = createRoot(popupContainer);

				// Finallyr react component inside Leaflet popup rendering all
				popupRoot.render(
					<PharmacyMarkerPopup
						pharmacy={pharmacy}
						products={products}
						onAddToCart={addProductToCart}
					/>
				);

				// Attach popup to marker
				marker.bindPopup(popupContainer, { maxWidth: 420 });
			}
		}

		initializeMap();

		// Ccleanup function which removes the leaflet map when the component unmounts or re-renders.
		// Again it is important becouse this prevents multiple maps, and Leaflet errors when react re-runs the effec
		// what was one of my issueas to sort out before my map has been rendered finally.
		return () => {
			if (leafletMap) leafletMap.remove();
		};
	}, [pharmacies, cartItems, addProductToCart]);

	//Container for leaflet uses this div by ID

	return (
		<div
			id="pharmacies-map"
			style={{
				height: "520px",
				width: "100%",
				marginTop: "2rem",
				borderRadius: "8px",
			}}
		/>
	);
}
