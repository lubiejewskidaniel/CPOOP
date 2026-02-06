/*
This renders the sidebar menu
for normal users.
Reuses the SharedMenuList component
Shows only the common menu items
Keeps the code simple and reusable
*/

import SharedMenuList from "./SharedMenuList";

export default function UserSidebarMenu() {
	// Normal users only will see shared menu items
	return <SharedMenuList />;
}
