// This component will be  basically the "Products" admin page.
// I’m not dont wantto do any logic here, I just place the add-product form at the top
// and the list of products under it. The real actions like add/edit/delete will happen
// inside ProductForm and ProductList. so it gonna be a server component
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import styles from "./ManageProducts.module.css";

export default function ManageProducts() {
	return (
		<div className={styles.page}>
			{/* Page title */}
			<h1 className={styles.title}>Manage Products</h1>

			{/* Form for adding a new product */}
			<ProductForm />

			{/* Simple separator between form and list */}
			<hr className={styles.separator} />

			{/* List of existing products */}
			<h2 className={styles.subtitle}>Product List</h2>
			<ProductList />
		</div>
	);
}
