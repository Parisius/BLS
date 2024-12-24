"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTransferSharesForm } from "@/lib/governance/shareholding/hooks";
import { useTransferShares } from "@/services/api-sdk/models/shareholding";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag, User } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";
import ShareholderSelect from "@/components/governance/shareholding/inputs/shareholder-select";
import { cn } from "@/lib/utils";
import { NumberInput } from "@/components/ui/number-input";
import ThirdPartySelect from "@/components/governance/shareholding/inputs/third-party-select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormattedMessage, useIntl } from "react-intl";
export default function TransferSharesForm({
  formId,
  className,
  onSuccess,
  onError,
}) {
  const form = useTransferSharesForm();
  const { mutateAsync } = useTransferShares();
  const intl = useIntl();
  const setMaxShares = useCallback(
    (shareholder) => {
      if (shareholder) {
        form.setValue("maxShares", shareholder.unencumberedShares);
      }
    },
    [form]
  );
  const handleSubmit = useCallback(
    async (data) => {
      let buyerId;
      if (data.type === "shareholder") {
        buyerId = data.shareholderId;
      } else if (data.type === "old_tier") {
        buyerId = data.thirdPartyId;
      }
      await mutateAsync(
        {
          ...data,
          type: data.type === "shareholder" ? "shareholder" : "tier",
          buyerId,
          thirdParty: data.type === "new_tier" ? data.thirdParty : undefined,
        },
        {
          onSuccess: () => {
            toast({
              description: "Actions transférées avec succès.",
              className: "bg-primary text-primary-foreground",
            });
            onSuccess?.();
          },
          onError: () => {
            toast({
              description:
                "Une erreur est survenue lors du transfert des actions.",
              className: "bg-destructive text-destructive-foreground",
            });
            onError?.();
          },
        }
      );
    },
    [mutateAsync, onError, onSuccess]
  );
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);
  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-5", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-2 space-y-3">
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex items-center justify-center gap-5"
                >
                  <FormItem className="flex items-center gap-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="shareholder" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      <FormattedMessage
                        id="shareholding.transfer_shares_to_shareholder"
                        defaultMessage="To a shareholder"
                      />
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="new_tier" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      <FormattedMessage
                        id="shareholding.transfer_shares_to_non_shareholder"
                        defaultMessage="To a non-shareholder"
                      />
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sellerId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage
                  id="shareholding.transfer_shares_seller"
                  defaultMessage="Seller"
                />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <ShareholderSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    onShareholderSelect={setMaxShares}
                    disabled={form.formState.isSubmitting}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("type") === "shareholder" && (
          <FormField
            control={form.control}
            name="shareholderId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  <FormattedMessage
                    id="shareholding.transfer_shares_beneficiary"
                    defaultMessage="Beneficiary"
                  />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <ShareholderSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      className="h-12 pl-10"
                    />
                    <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("type") === "old_tier" && (
          <FormField
            control={form.control}
            name="thirdPartyId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tiers</FormLabel>
                <FormControl>
                  <div className="relative">
                    <ThirdPartySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      className="h-12 pl-10"
                    />
                    <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("type") === "new_tier" && (
          <FormField
            control={form.control}
            name="thirdParty.name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  <FormattedMessage
                    id="shareholding.transfer_shares_to_non_shareholder_name"
                    defaultMessage="Name of non-shareholder"
                  />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder={intl.formatMessage({
                        id: "shareholding.transfer_shares_to_non_shareholder_placeholder",
                      })}
                      className="h-12 pl-10"
                    />
                    <User className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="shares"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage
                  id="shareholding.transfer_shares_number"
                  defaultMessage="Number of Shares"
                />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <NumberInput
                    {...field}
                    disabled={!form.watch("sellerId")}
                    placeholder="Nombre d'actions"
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              {form.watch("maxShares") && (
                <p className="text-sm">
                  <span className="font-semibold">Maximum:</span>{" "}
                  <span className="italic">{form.watch("maxShares")}</span>
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transferDate"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage
                  id="shareholding.transfer_shares_date"
                  defaultMessage="Date of transfer"
                />
              </FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  className="h-12"
                  onChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                  maxDate={new Date()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
