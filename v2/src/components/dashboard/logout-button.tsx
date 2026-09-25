"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ label }: { label: string }) {
  return (
    <Button
      variant="ghost"
      className="gap-2 text-destructive"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut />
      <span className="sr-only md:not-sr-only">{label}</span>
    </Button>
  );
}
