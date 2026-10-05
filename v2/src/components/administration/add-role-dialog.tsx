"use client";

import { useState } from "react";
import { ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/auth/can";
import { RoleFormDialog } from "@/components/administration/role-dialogs";
import { useDictionary } from "@/lib/i18n/locale-provider";

export function AddRoleDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useDictionary();

  return (
    <Can permission="role.create">
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <ShieldPlus />
        <span className="sr-only sm:not-sr-only">{t.administration.roles.newRole}</span>
      </Button>
      {open && <RoleFormDialog open onOpenChange={setOpen} />}
    </Can>
  );
}
