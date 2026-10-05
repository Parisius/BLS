"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, LogIn, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoginForm, type LoginFormValues } from "@/lib/auth/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function LoginForm() {
  const form = useLoginForm();
  const router = useRouter();
  const { t } = useDictionary();

  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        const reasons: Record<string, string> = {
          invalid_data: t.auth.invalidData,
          tenant_not_found: t.auth.tenantNotFound,
          unreachable: t.auth.unreachable,
        };
        toast.error((result.code && reasons[result.code]) || t.auth.invalidCredentials);
        return;
      }

      toast.success(t.auth.loginSuccess);
      router.push("/dashboard/modules");
      router.refresh();
    },
    [router, t],
  );

  return (
    <Form {...form}>
      <form
        className="container grid grid-cols-2 gap-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{t.auth.identifier}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={t.auth.identifier}
                    className="h-12 pl-10"
                  />
                  <User className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{t.auth.password}</FormLabel>
              <FormControl>
                <div className="relative">
                  <PasswordInput
                    {...field}
                    placeholder="********"
                    className="h-12 pl-10"
                    showLabel={t.auth.showPassword}
                    hideLabel={t.auth.hidePassword}
                  />
                  <Lock className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="col-span-2 gap-2 md:col-span-1 md:w-fit"
        >
          {t.auth.login}
          <LogIn />
        </Button>
      </form>
    </Form>
  );
}
