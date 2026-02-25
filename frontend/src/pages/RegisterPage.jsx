import AuthPage from "./AuthPage";

export function RegisterPage() {
  return (
    <AuthPage
      title="Register to SimplifyQL"
      apiEndpoint="/users/register"
      submitLabel="Register"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Login"
    />
  );
}
