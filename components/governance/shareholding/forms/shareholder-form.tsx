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
import { Tag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShareholderForm } from "@/lib/governance/shareholding/hooks";
import {
  corporateTypes,
  shareholderTypes,
} from "@/services/api-sdk/types/shareholding";
import CountrySelect from "@/components/ui/country-select";
import { NumberInput } from "@/components/ui/number-input";
import { FormattedMessage, useIntl } from "react-intl";
export default function ShareholderForm({ formId, className, onSubmit }) {
  const form = useShareholderForm();
  const intl = useIntl();

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
                <FormattedMessage id="shareholding.add_shareholder_form_type_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 pl-10">
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "shareholding.add_shareholder_form_type_placeholder",
                        })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {shareholderTypes.map((type) => (
                        <SelectItem value={type.value} key={type.value}>
                          {type.label}
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

        {form.watch("type") === "corporate" && (
          <FormField
            control={form.control}
            name="corporateType"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>
                  <FormattedMessage id="shareholding.add_shareholder_form_corporate_type_label" />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 pl-10">
                        <SelectValue
                          placeholder={intl.formatMessage({
                            id: "shareholding.add_shareholder_form_corporate_type_placeholder",
                          })}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {corporateTypes.map((type) => (
                          <SelectItem value={type.value} key={type.value}>
                            {type.label}
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
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {form.watch("type") === "individual"
                  ? intl.formatMessage({
                      id: "shareholding.add_shareholder_form_name_label_individual",
                    })
                  : intl.formatMessage({
                      id: "shareholding.add_shareholder_form_name_label_corporate",
                    })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={
                      form.watch("type") === "individual"
                        ? intl.formatMessage({
                            id: "shareholding.add_shareholder_form_name_label_individual",
                          })
                        : intl.formatMessage({
                            id: "shareholding.add_shareholder_form_name_label_corporate",
                          })
                    }
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
          name="nationality"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage id="shareholding.add_shareholder_form_nationality_label" />
              </FormLabel>
              <FormControl>
                <CountrySelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={intl.formatMessage({
                    id: "shareholding.add_shareholder_form_nationality_placeholder",
                  })}
                  className="h-12"
                />
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
              <FormLabel>
                <FormattedMessage id="shareholding.add_shareholder_form_address_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "shareholding.add_shareholder_form_address_placeholder",
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

        <FormField
          control={form.control}
          name="encumberedShares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="shareholding.add_shareholder_form_encumbered_shares_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <NumberInput
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "shareholding.add_shareholder_form_encumbered_shares_placeholder",
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
          name="unencumberedShares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="shareholding.add_shareholder_form_unencumbered_shares_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <NumberInput
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "shareholding.add_shareholder_form_unencumbered_shares_placeholder",
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
