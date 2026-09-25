"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStakeholderForm, type StakeholderFormValues } from "@/lib/contract/forms";
import { useCreateStakeholder } from "@/lib/contract/hooks";
import { useDictionary } from "@/lib/i18n/locale-provider";

interface AddStakeholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (stakeholderId: string) => void;
}

export function AddStakeholderDialog({ open, onOpenChange, onCreated }: AddStakeholderDialogProps) {
  const form = useStakeholderForm();
  const { mutateAsync } = useCreateStakeholder();
  const { t } = useDictionary();
  const type = form.watch("type");

  const handleSubmit = form.handleSubmit(async (values: StakeholderFormValues) => {
    await mutateAsync(values, {
      onSuccess: (created) => {
        toast.success("Le membre a été ajouté avec succès.");
        form.reset();
        onOpenChange(false);
        onCreated(String(created.id));
      },
      onError: () => toast.error("Une erreur est survenue lors de l'ajout du membre."),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.contract.addStakeholder.dialog.title}</DialogTitle>
          <DialogDescription>{t.contract.addStakeholder.dialog.description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="add-stakeholder-form" className="space-y-5" onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex items-center justify-center gap-5"
                    >
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="individual" id="stakeholder-individual" />
                        <Label htmlFor="stakeholder-individual" className="font-normal">
                          {t.contract.stakeholderForm.individual}
                        </Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <RadioGroupItem value="corporate" id="stakeholder-corporate" />
                        <Label htmlFor="stakeholder-corporate" className="font-normal">
                          {t.contract.stakeholderForm.corporate}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-x-5 gap-y-6">
              {type === "corporate" && (
                <FormField
                  control={form.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t.contract.corporateMemberForm.denomination}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {type === "corporate"
                        ? t.contract.corporateMemberForm.representative
                        : t.contract.individualMemberForm.name}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.contract.individualMemberForm.email}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.contract.individualMemberForm.phone}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {type === "corporate" && (
                <>
                  <FormField
                    control={form.control}
                    name="numberRCCM"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contract.corporateMemberForm.numberRCCM}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberIFU"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contract.corporateMemberForm.numberIFU}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capital"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>{t.contract.corporateMemberForm.capital}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={value ?? ""}
                            onChange={(e) => onChange(e.target.valueAsNumber)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="cardId"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t.contract.individualMemberForm.cardId}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.contract.individualMemberForm.residence}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.contract.individualMemberForm.zipCode}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button type="button" variant="destructive" onClick={() => form.reset()}>
            {t.contract.addStakeholder.dialog.cancel}
          </Button>
          <Button type="submit" form="add-stakeholder-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "..." : t.contract.addStakeholder.dialog.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
