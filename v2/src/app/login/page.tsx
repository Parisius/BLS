import { LoginForm } from "@/components/auth/login-form";
import { getDictionary } from "@/lib/i18n/locale";

export default async function LoginPage() {
  const { t } = await getDictionary();

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="container flex flex-col items-center">
        <h1 className="text-xl font-semibold">{t.auth.loginTitle}</h1>
        <p className="text-center text-sm text-foreground/50">
          {t.auth.loginDescription}
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
