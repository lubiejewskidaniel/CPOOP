// Server route file.
// It renders the AuthContainer component, which handles the authentication UI and logic
// switching between Login/Register forms and managing user sign-in/sign-up.

import AuthContainer from "@/components/auth/AuthContainer";

export default function LoginOrRegisterPage() {
	return <AuthContainer />;
}
