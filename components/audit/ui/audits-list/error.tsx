"use client";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RotateCw } from "lucide-react";
function ErrorComponent({ resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <Image
        src="/global/images/error.svg"
        alt="Error"
        width={300}
        height={300}
      />
      <p className="text-center text-lg italic text-secondary-foreground/75">
        Une erreur s&apos;est produite
      </p>
      <Button className="gap-2" onClick={resetErrorBoundary}>
        <RotateCw />
        Reessayer
      </Button>
    </div>
  );
}
export function AuditsListErrorBoundary({ children }) {
  return (
    <ErrorBoundary fallbackRender={ErrorComponent}>{children}</ErrorBoundary>
  );
}
