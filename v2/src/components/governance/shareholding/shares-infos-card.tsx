"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Banknote, CircleDollarSign, Landmark, Pencil, Tag, User, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ShareholdersModal } from "@/components/governance/shareholding/shareholders-ui";
import { useBankInfos, useCreateBankCapital, useUpdateBankInfos } from "@/lib/governance/shareholding/hooks";
import { useBankCapitalForm, useBankInfosForm } from "@/lib/governance/shareholding/forms";
import type { BankInfos } from "@/lib/governance/shareholding/bank";
import { cn } from "@/lib/utils";
import { formatAmount, formatNumber } from "@/lib/shared/format";
import { useDictionary } from "@/lib/i18n/locale-provider";
import { Can } from "@/components/auth/can";
import { usePermissions } from "@/lib/auth/use-permissions";

function AddBankCapitalDialog({ trigger, children }: { trigger: React.ReactElement; children: React.ReactNode }) {
  const form = useBankCapitalForm();
  const { mutateAsync } = useCreateBankCapital();
  const { t } = useDictionary();
  const td = t.shareholding.capitalDialog;
  const [open, setOpen] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        toast.success(td.success);
        form.reset();
        setOpen(false);
      },
      onError: () => toast.error(td.error),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{td.title}</DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="add-capital-form"
            noValidate className="space-y-6" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="capital"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{td.capitalLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={Number.isNaN(value) ? "" : value}
                      onChange={(e) => onChange(e.target.valueAsNumber)}
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nominalValue"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{td.nominalValueLabel}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={Number.isNaN(value) ? "" : value}
                      onChange={(e) => onChange(e.target.valueAsNumber)}
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td.dateLabel}</FormLabel>
                  <FormControl>
                    <Input type="date" max={new Date().toLocaleDateString("en-CA")} {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" onClick={() => form.reset()} />}>
            {td.cancel}
          </DialogClose>
          <Button type="submit" form="add-capital-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : td.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateBankInfosDialog({ bank, trigger, children }: { bank: BankInfos; trigger: React.ReactElement; children: React.ReactNode }) {
  const form = useBankInfosForm({ name: bank.name ?? "", headOffice: bank.headOffice ?? "" });
  const { mutateAsync } = useUpdateBankInfos();
  const { t } = useDictionary();
  const td = t.shareholding.bankInfosDialog;
  const [open, setOpen] = useState(false);

  const logo = form.watch("logo");
  const logoPreview = useMemo(() => (logo ? URL.createObjectURL(logo) : undefined), [logo]);
  useEffect(() => () => (logoPreview ? URL.revokeObjectURL(logoPreview) : undefined), [logoPreview]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append("denomination", values.name);
    formData.append("siege_social", values.headOffice);
    if (values.logo) formData.append("logo", values.logo);
    await mutateAsync(formData, {
      onSuccess: () => {
        toast.success(td.success);
        setOpen(false);
      },
      onError: () => toast.error(td.error),
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{td.title}</DialogTitle>
          <DialogDescription>{td.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="update-bank-infos-form"
            noValidate className="space-y-6" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className="relative w-fit justify-self-center self-center">
                  {field.value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={td.removeLogo}
                      className="absolute right-0 top-0 z-10 rounded-full text-destructive"
                      onClick={() => field.onChange(undefined)}
                    >
                      <X />
                    </Button>
                  )}
                  <FormControl>
                    <label
                      className="flex h-16 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed text-sm text-muted-foreground"
                      style={
                        logoPreview
                          ? { backgroundImage: `url(${logoPreview})`, backgroundSize: "cover", backgroundPosition: "center" }
                          : undefined
                      }
                    >
                      {!logoPreview && td.logoLabel}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </label>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td.nameLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{td.headOfficeLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose render={<Button type="button" variant="destructive" />}>{td.cancel}</DialogClose>
          <Button type="submit" form="update-bank-infos-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : td.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-1 font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

const LINK_BUTTON = <Button variant="link" className="h-auto p-0 italic underline" />;

/** Value that opens the capital dialog, or a pencil + dash when no capital was recorded yet. */
function CapitalValue({ value }: { value?: string }) {
  const { can } = usePermissions();
  if (!can("governance.manage_shareholding")) return <span className="italic text-muted-foreground">{value ?? "-"}</span>;
  if (value) {
    return <AddBankCapitalDialog trigger={LINK_BUTTON}>{value}</AddBankCapitalDialog>;
  }
  return (
    <div className="flex items-center gap-2">
      <AddBankCapitalDialog trigger={<Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" />}>
        <Pencil />
      </AddBankCapitalDialog>
      <span>-</span>
    </div>
  );
}

export function SharesInfosCard({ className }: { className?: string }) {
  const { data, isLoading } = useBankInfos();
  const { t } = useDictionary();
  const tc = t.shareholding.card;

  if (isLoading || !data) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="space-y-6 py-6">
          <Skeleton className="mx-auto h-24 w-36" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="relative gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- logo is served from the API host */}
        <img
          src={data.logoUrl ?? "/global/images/default-bank-logo.webp"}
          alt={tc.logoAlt}
          width={150}
          height={100}
          className="h-auto max-h-24 w-auto self-center object-contain"
        />
        <Can permission="governance.manage_shareholding">
          <UpdateBankInfosDialog
            key={`${data.name}|${data.headOffice}`}
            bank={data}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label={tc.editBankInfos}
                className="absolute right-5 top-5 rounded-full text-muted-foreground"
              />
            }
          >
            <Pencil />
          </UpdateBankInfosDialog>
        </Can>
      </CardHeader>
      <CardContent className="space-y-10">
        <InfoRow icon={<Tag />} label={tc.name}>
          <span className="italic text-muted-foreground">{data.name ?? "-"}</span>
        </InfoRow>
        <InfoRow icon={<Landmark />} label={tc.headOffice}>
          <span className="italic text-muted-foreground">{data.headOffice ?? "-"}</span>
        </InfoRow>
        <InfoRow icon={<CircleDollarSign />} label={tc.capital}>
          <CapitalValue value={data.capital ? formatAmount(data.capital) : undefined} />
        </InfoRow>
        <InfoRow icon={<Banknote />} label={tc.nominalValue}>
          <CapitalValue value={data.nominalValue ? formatAmount(data.nominalValue) : undefined} />
        </InfoRow>
        <InfoRow icon={<Banknote />} label={tc.numberOfShares}>
          <CapitalValue
            value={data.capital && data.nominalValue ? formatNumber(data.capital / data.nominalValue) : undefined}
          />
        </InfoRow>
        <InfoRow icon={<Users />} label={tc.shareholders}>
          <ShareholdersModal trigger={LINK_BUTTON}>{formatNumber(data.shareholdersCount)}</ShareholdersModal>
        </InfoRow>
        <InfoRow icon={<User />} label={tc.majorityShareholder}>
          <span className="inline-flex gap-1 italic text-muted-foreground">
            {data.majorityShareholder ? (
              <>
                <span className="line-clamp-1 max-w-[10rem] break-all">{data.majorityShareholder.name}</span>
                <span>({data.majorityShareholder.sharePercentage ?? "-"}%)</span>
              </>
            ) : (
              "-"
            )}
          </span>
        </InfoRow>
      </CardContent>
    </Card>
  );
}
