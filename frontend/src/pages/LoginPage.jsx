import AuthPage from "./AuthPage";

export function LoginPage() {
  return (
    <AuthPage
      title="Welcome back to SimplifyQL"
      apiEndpoint="/users/login"
      submitLabel="Login"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkLabel="Register"
    />
  );
}
