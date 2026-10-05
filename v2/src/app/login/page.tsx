import { LoginForm } from "@/components/auth/login-form";
import { getDictionary } from "@/lib/i18n/locale";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { t } = await getDictionary();
  const { expired } = await searchParams;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="container flex flex-col items-center">
        <h1 className="text-xl font-semibold">{t.auth.loginTitle}</h1>
        <p className="text-center text-sm text-foreground/50">
          {t.auth.loginDescription}
        </p>
      </div>
      {expired && (
        <p role="status" className="text-center text-sm text-destructive">
          {t.auth.sessionExpired}
        </p>
      )}
      <LoginForm />
    </div>
  );
}
