"use server";

import { firestoreDatabase } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/*
  This helper function converts ONE Firestore document into a simple JS object.
*/
function toSafeProduct(docSnap) {
	// Gets the raw data stored inside this Firestore document
	const d = docSnap.data();

	// Returns product object with default values if something is missing
	return {
		// Firestore document id
		id: docSnap.id,

		//  product info - using empty string if field doesn't exist
		productName: d.productName ?? "",
		pharmacyName: d.pharmacyName ?? "",
		category: d.category ?? "",

		// Making sure price and quantity are numbers
		price: Number(d.price ?? 0),
		quantity: Number(d.quantity ?? 0),
	};
}

/*
  This is a Server Action that loads "featured products".

  What it does (step by step):
  - Read ALL products from the "products" collection in Firestore
  - Convert every Firestore document into object using toSafeProduct
  - Sort products by quantity - lowest stock will display first
  - and rReturn only the first 10 products top 10 low-stock items
*/
export async function getFeaturedProductsAction() {
	// Get all documents from the "products" collection
	const snap = await getDocs(collection(firestoreDatabase, "products"));

	//conversion
	const all = snap.docs.map(toSafeProduct);

	// sorting
	all.sort((a, b) => a.quantity - b.quantity);

	// Returns only 10 products
	return all.slice(0, 10);
}
