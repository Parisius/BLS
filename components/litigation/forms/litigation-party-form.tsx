"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import { useLitigationPartyForm } from "@/lib/litigation/hooks";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { partyTypes } from "@/services/api-sdk/types/litigation/litigation-party";
import { useMemo } from "react";
import { useIntl } from "react-intl"; // Import useIntl

export default function LitigationPartyForm({ formId, className, onSubmit }) {
  const intl = useIntl(); // Récupérer l'objet intl
  const form = useLitigationPartyForm();

  // Traduire les libellés dynamiques
  const nameLabel = useMemo(() => {
    switch (form.watch("type")) {
      case "legal":
        return intl.formatMessage({
          id: "litigation.litigationPartyForm.legalName",
        });
      case "individual":
        return intl.formatMessage({
          id: "litigation.litigationPartyForm.individualName",
        });
      default:
        return undefined;
    }
  }, [form, intl]);

  const addressLabel = useMemo(() => {
    switch (form.watch("type")) {
      case "legal":
        return intl.formatMessage({
          id: "litigation.litigationPartyForm.legalAddress",
        });
      case "individual":
        return intl.formatMessage({
          id: "litigation.litigationPartyForm.individualAddress",
        });
      default:
        return undefined;
    }
  }, [form, intl]);

  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({
                  id: "litigation.litigationPartyForm.type",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 pl-10">
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "litigation.litigationPartyForm.selectType",
                        })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {partyTypes.map((category) => (
                        <SelectItem value={category.value} key={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{nameLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={nameLabel}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>{addressLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={addressLabel}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
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
              <FormLabel>
                {intl.formatMessage({
                  id: "litigation.litigationPartyForm.phone",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "litigation.litigationPartyForm.phone",
                    })}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
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
              <FormLabel>
                {intl.formatMessage({
                  id: "litigation.litigationPartyForm.email",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "litigation.litigationPartyForm.email",
                    })}
                    className="h-12 pl-10"
                  />
                  <Tag className="absolute bottom-1/2 left-3 translate-y-1/2 text-foreground/50" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
