"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CriteriaView } from "@/components/audit/criteria-view";
import { AUDIT_MODULES, type AuditModule } from "@/lib/audit/constants";
import { useDictionary } from "@/lib/i18n/locale-provider";

/** Tiles for every auditable module; each opens the criteria configuration of that module. */
export function ModulesList() {
  const { t } = useDictionary();
  const tm = t.audit.manageModule;
  const [module, setModule] = useState<AuditModule | null>(null);
  const items = useMemo(() => AUDIT_MODULES.map((value) => ({ value, label: t.audit.modules[value] })), [t]);

  return (
    <>
      <div className="grid auto-rows-fr gap-10 sm:grid-cols-2 md:grid-cols-3">
        {AUDIT_MODULES.map((value) => (
          <button key={value} type="button" className="text-start" onClick={() => setModule(value)}>
            <Card className="h-full cursor-pointer bg-primary text-primary-foreground">
              <CardHeader className="h-full items-center justify-center">
                <CardTitle className="text-center">{t.audit.modules[value]}</CardTitle>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
      <Dialog open={!!module} onOpenChange={(open) => !open && setModule(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{tm.title}</DialogTitle>
            <DialogDescription>{tm.description}</DialogDescription>
          </DialogHeader>
          {module && (
            <div className="-mx-4 max-h-[70vh] space-y-10 overflow-auto px-4 py-2">
              <div className="space-y-2">
                <Label>{tm.module}</Label>
                <Select value={module} items={items} onValueChange={(next) => next && setModule(next as AuditModule)}>
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder={tm.selectModule} />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CriteriaView key={module} module={module} label={tm.criteria} />
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="destructive" />}>{tm.close}</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
