"use client";
import { useCallback, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAddAdministratorForm } from "@/lib/governance/administration-meeting/hooks";
import {
  administratorQualities,
  administratorQualitiesItnl,
  administratorRoles,
  administratorRolesItnl,
  administratorTypes,
  administratorTypesItnl,
} from "@/services/api-sdk/types/administration-meeting";
import { useCreateAdministrator } from "@/services/api-sdk/models/administration-meeting/administrator";
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
import { DateInput } from "@/components/ui/date-input";
import CountrySelect from "@/components/ui/country-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { NumberInput } from "@/components/ui/number-input";
import { FormattedMessage, useIntl } from "react-intl";
export default function AddAdministratorForm({
  formId,
  className,
  onSuccess,
  onError,
}) {
  const intl = useIntl();
  const form = useAddAdministratorForm();
  const { mutateAsync } = useCreateAdministrator();
  const handleSubmit = useCallback(
    async (data) => {
      await mutateAsync(data, {
        onSuccess: (createdData) => {
          toast({
            description: "Administrateur ajouté avec succès !",
            className: "bg-primary text-primary-foreground",
          });
          onSuccess?.(createdData);
        },
        onError: () => {
          toast({
            description:
              "Une erreur est survenue lors de l'ajout de l'administrateur.",
            className: "bg-destructive text-destructive-foreground",
          });
          onError?.();
        },
      });
    },
    [mutateAsync, onError, onSuccess]
  );
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);
  const translatedQualities = administratorQualitiesItnl.map((quality) => ({
    ...quality,
    label: intl.formatMessage(quality.label),
  }));

  const translatedRoles = administratorRolesItnl.map((role) => ({
    ...role,
    label: intl.formatMessage(role.label),
  }));

  const translatedTypes = administratorTypesItnl.map((type) => ({
    ...type,
    label: intl.formatMessage(type.label),
  }));
  return (
    <Form {...form}>
      <form
        id={formId}
        className={cn("grid grid-cols-2 gap-x-5 gap-y-10", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_administrator_form_type_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 pl-10">
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "sessionAdministrator.update_administrator_form_type_placeholder",
                        })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {translatedTypes.map((type) => (
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

        <FormField
          control={form.control}
          name="quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_administrator_form_quality_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 pl-10">
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "sessionAdministrator.update_administrator_form_quality_placeholder",
                        })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {translatedQualities.map((quality) => (
                        <SelectItem value={quality.value} key={quality.value}>
                          {quality.label}
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_administrator_form_role_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-12 pl-10">
                      <SelectValue
                        placeholder={intl.formatMessage({
                          id: "sessionAdministrator.update_administrator_form_role_placeholder",
                        })}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {translatedRoles.map((role) => (
                        <SelectItem value={role.value} key={role.value}>
                          {role.label}
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
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {form.watch("type") === "individual" ? (
                  <FormattedMessage id="sessionAdministrator.update_administrator_form_name_label" />
                ) : (
                  <FormattedMessage id="sessionAdministrator.update_administrator_form_denomination_label" />
                )}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={
                      form.watch("type") === "individual"
                        ? intl.formatMessage({
                            id: "sessionAdministrator.update_administrator_form_name_placeholder",
                          })
                        : intl.formatMessage({
                            id: "sessionAdministrator.update_administrator_form_denomination_placeholder",
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
                <FormattedMessage id="sessionAdministrator.update_administrator_form_nationality_label" />
              </FormLabel>
              <FormControl>
                <CountrySelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={intl.formatMessage({
                    id: "sessionAdministrator.update_administrator_form_nationality_placeholder",
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
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_administrator_form_birth_date_label" />
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

        <FormField
          control={form.control}
          name="birthPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_administrator_form_birth_place_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "sessionAdministrator.update_administrator_form_birth_place_placeholder",
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
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_administrator_form_address_label" />
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "sessionAdministrator.update_administrator_form_address_placeholder",
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

        {form.watch("quality") === "shareholder" && (
          <>
            <FormField
              control={form.control}
              name="share"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="sessionAdministrator.update_administrator_form_share_label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <NumberInput
                        {...field}
                        placeholder={intl.formatMessage({
                          id: "sessionAdministrator.update_administrator_form_share_placeholder",
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
              name="sharePercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="sessionAdministrator.update_administrator_form_share_percentage_label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <NumberInput
                        {...field}
                        placeholder={intl.formatMessage({
                          id: "sessionAdministrator.update_administrator_form_share_percentage_placeholder",
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
          </>
        )}

        {form.watch("type") === "corporate" && (
          <>
            <FormField
              control={form.control}
              name="denomination"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    <FormattedMessage id="sessionAdministrator.update_administrator_form_denomination_label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={intl.formatMessage({
                          id: "sessionAdministrator.update_administrator_form_denomination_placeholder",
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
              name="companyHeadOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="sessionAdministrator.update_administrator_form_company_head_office_label" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={intl.formatMessage({
                          id: "sessionAdministrator.update_administrator_form_company_head_office_placeholder",
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
              name="companyNationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormattedMessage id="sessionAdministrator.update_administrator_form_company_nationality_label" />
                  </FormLabel>
                  <FormControl>
                    <CountrySelect
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={intl.formatMessage({
                        id: "sessionAdministrator.update_administrator_form_company_nationality_placeholder",
                      })}
                      className="h-12"
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
          name="mandateStartDate"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                <FormattedMessage id="sessionAdministrator.update_mandate_form_start_date_label" />
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
