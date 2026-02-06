"use client";
// Another client side component
// This form is used by the pharmacy admin to add a new product.
// What I do here-first I load pharmacies that belong to the logged-in user,
// then the user picks a pharmacy, fills the product fields, and I save it to Firestore.
import { useEffect, useMemo, useState } from "react";
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	serverTimestamp,
} from "firebase/firestore";
import { firestoreDatabase } from "@/lib/firebase";
import { useAuthentication } from "@/context/AuthContext";
import styles from "./ProductForm.module.css";

// Simple fixed categories for now easier than letting user type random text
const productCategories = [
	"Prescription Meds",
	"Over-the-counter Meds",
	"Wellness Products",
];

export default function ProductForm() {
	// I need the user to:
	// load only their pharmacies
	// save ownerId on the new product
	const { authenticatedUser } = useAuthentication();

	// Stores pharmacies that are owned by this logged-in admin for the dropdown
	const [ownedPharmacies, setOwnedPharmacies] = useState([]);

	// Keeps the selected pharmacy id of course product must belong to a pharmacy
	const [chosenPharmacyId, setChosenPharmacyId] = useState("");

	// I keep all form inputs in one object, because it's less messy than 6 separate useStates
	const [productDraft, setProductDraft] = useState({
		productName: "",
		category: "",
		description: "",
		expiryDate: "",
		price: "",
		quantity: "",
	});

	// Loading flag while I fetch pharmacies for the dropdown
	const [isPharmaciesLoading, setIsPharmaciesLoading] = useState(true);

	// Loading flag for the Add button (so user can't submit twice)
	const [isSavingProduct, setIsSavingProduct] = useState(false);

	// text message for errors if happen
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		// I run this when the user becomes available.
		// The idea is when the page loads, I fetch pharmacies for this user.
		async function loadMyPharmacies() {
			// If there is no logged-in user yet, I can't run the query.
			// I just stop loading so the UI doesn't get stuck.
			if (!authenticatedUser) {
				setIsPharmaciesLoading(false);
				return;
			}

			try {
				// Firestore query which works for only pharmacies where ownerId matches my user id
				const myPharmaciesQuery = query(
					collection(firestoreDatabase, "pharmacies"),
					where("ownerId", "==", authenticatedUser.uid)
				);

				// One-time fetch - not realtime, just enough for the dropdown
				const snapshot = await getDocs(myPharmaciesQuery);

				// Convert Firestore docs into normal JS objects, and add doc.id manually
				const mappedPharmacies = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setOwnedPharmacies(mappedPharmacies);
			} catch (error) {
				// I needed this to debug error will change later if no neeeded anymore maybe
				console.error("Failed to load pharmacies:", error);
				setErrorMessage("Could not load pharmacies.");
			} finally {
				// Whatever happens, I stop showing the loading text
				setIsPharmaciesLoading(false);
			}
		}

		loadMyPharmacies();
	}, [authenticatedUser]);

	// Kind of helpers for UI decisions
	const hasPharmacies = ownedPharmacies.length > 0;
	const isPharmacyChosen = chosenPharmacyId !== "";

	// I find the chosen pharmacy object so I can save pharmacyName too not just id.
	// useMemo is just to avoid recalculating it every render.
	const chosenPharmacy = useMemo(() => {
		return ownedPharmacies.find((p) => p.id === chosenPharmacyId) || null;
	}, [ownedPharmacies, chosenPharmacyId]);

	// One change handler for all fields.
	// It uses the input name to update the right key in productDraft.
	function updateDraftField(event) {
		const { name, value } = event.target;

		setProductDraft((previousDraft) => ({
			...previousDraft,
			[name]: value,
		}));
	}

	// Resets everything back to empty.
	// I use it after successful save and also when user clicks Cancel.
	function resetForm() {
		setChosenPharmacyId("");
		setProductDraft({
			productName: "",
			category: "",
			description: "",
			expiryDate: "",
			price: "",
			quantity: "",
		});
		setErrorMessage(null);
	}

	// This runs when the user clicks Add -form submit.
	// It validates, then creates a new product document in Firestore.
	async function saveNewProduct(event) {
		event.preventDefault(); // stop page refresh
		setErrorMessage(null);

		// Just in case- no user means I don't save ownerId
		if (!authenticatedUser) {
			setErrorMessage("You must be logged in.");
			return;
		}

		// Must pick pharmacy first -product belongs to a pharmacy
		if (!chosenPharmacy) {
			setErrorMessage("Please choose a pharmacy first.");
			return;
		}

		// Validation to check if user fill up all fields
		const missingField =
			!productDraft.productName ||
			!productDraft.category ||
			!productDraft.description ||
			!productDraft.expiryDate ||
			!productDraft.price ||
			!productDraft.quantity;

		if (missingField) {
			setErrorMessage("Please fill all fields.");
			return;
		}

		setIsSavingProduct(true);

		try {
			// Create a new product document in Firestore
			await addDoc(collection(firestoreDatabase, "products"), {
				// Linking product to the selected pharmacy
				pharmacyId: chosenPharmacy.id,
				pharmacyName: chosenPharmacy.name,

				// Linking product to the admin user gonna be usful probably later
				ownerId: authenticatedUser.uid,

				// Form values
				productName: productDraft.productName,
				category: productDraft.category,
				description: productDraft.description,
				expiryDate: productDraft.expiryDate,

				// Inputs are strings, but I want numbers in Firestore
				price: Number(productDraft.price),
				quantity: Number(productDraft.quantity),

				// Firestore timestamp gonna be usful to flter by newest
				createdAt: serverTimestamp(),
			});

			// If it worked, clear the form
			resetForm();
		} catch (error) {
			setErrorMessage("Failed to add product.");
		} finally {
			// Always turn off saving mode
			setIsSavingProduct(false);
		}
	}

	// While the dropdown data is loading, show short information
	if (isPharmaciesLoading) return <p>Loading pharmacies...</p>;

	return (
		<div className={styles.box}>
			<h2 className={styles.title}>Add Product</h2>

			{/* pick which pharmacy the product is for */}
			<label className={styles.field}>
				<span className={styles.label}>Pharmacy</span>

				<select
					value={chosenPharmacyId}
					onChange={(e) => setChosenPharmacyId(e.target.value)}
				>
					<option value="">Choose Pharmacy</option>

					{/* If admin has no pharmacies, showappropriate information */}
					{!hasPharmacies && <option disabled>No registered pharmacy</option>}

					{/* If pharmacies exist, show them as options */}
					{hasPharmacies &&
						ownedPharmacies.map((pharmacy) => (
							<option key={pharmacy.id} value={pharmacy.id}>
								{pharmacy.name}
							</option>
						))}
				</select>
			</label>

			{/* only show product fields after pharmacy is chosen */}
			{isPharmacyChosen && (
				<form onSubmit={saveNewProduct} className={styles.form}>
					{/* Product name */}
					<span className={styles.label}>Product Name:</span>
					<input
						name="productName"
						placeholder="Product Name"
						value={productDraft.productName}
						onChange={updateDraftField}
					/>

					{/* Category dropdown */}
					<span className={styles.label}>Select Category::</span>
					<select
						name="category"
						value={productDraft.category}
						onChange={updateDraftField}
					>
						<option value="">Choose Category</option>
						{productCategories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>

					{/* Expiry date */}
					<span className={styles.label}>Expiry date (dd/mm/yyyy)</span>
					<input
						name="expiryDate"
						type="date"
						value={productDraft.expiryDate}
						onChange={updateDraftField}
					/>

					{/* Description */}
					<span className={styles.label}>Description::</span>
					<textarea
						name="description"
						placeholder="Description"
						value={productDraft.description}
						onChange={updateDraftField}
					/>

					{/* Price */}
					<span className={styles.label}>Price:</span>
					<input
						name="price"
						type="number"
						placeholder="Price"
						value={productDraft.price}
						onChange={updateDraftField}
					/>

					{/* Quantity */}
					<span className={styles.label}>Quantity:</span>
					<input
						name="quantity"
						type="number"
						placeholder="Quantity"
						value={productDraft.quantity}
						onChange={updateDraftField}
					/>

					{/* If there is an error, shows it under the inputs */}
					{errorMessage && <p className={styles.error}>{errorMessage}</p>}

					{/* Buttons */}
					<div className={styles.actions}>
						{/* Disabled while saving so user can't spam submit */}
						<button type="submit" disabled={isSavingProduct}>
							{isSavingProduct ? "Adding..." : "Add"}
						</button>

						{/* Cancel just resets the fields */}
						<button
							type="button"
							onClick={resetForm}
							disabled={isSavingProduct}
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
