"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getPartyCategories,
  getPartyTypes,
} from "@/services/api-sdk/types/litigation/litigation";
import LitigationPartySelect from "../inputs/litigation-party-select";
import { useIntl } from "react-intl";

export default function LitigationPartiesSectionForm({
  label,
  fieldName,
  form,
  fieldArray,
  className,
}: {
  label?: string;
  fieldName: any;
  form: any;
  fieldArray: any;
  className?: any;
}) {
  const intl = useIntl();
  const partyCategories = getPartyCategories(intl);
  const partyTypes = getPartyTypes(intl);

  const handleRemoveRow = useCallback(
    (index) => {
      if (fieldArray.fields.length > 1) {
        fieldArray.remove(index);
      }
    },
    [fieldArray]
  );

  const handleAddRow = useCallback(() => {
    fieldArray.append({});
  }, [fieldArray]);

  return (
    <div
      className={cn(
        "relative col-span-2 flex flex-col gap-5 rounded-xl border-2 p-5",
        className
      )}
    >
      {label && (
        <span className="absolute left-3 top-0 -translate-y-1/2 bg-background px-2 text-sm font-semibold">
          {label}
        </span>
      )}
      {fieldArray.fields.map((item, index) => (
        <div key={item.id} className="flex gap-5">
          {/* Party Field */}
          <FormField
            control={form.control}
            name={`${fieldName}.${index}.partyId`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({
                    id: "litigation.litigation.partiesSection.partyLabel",
                  })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <LitigationPartySelect
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

          {/* Category Field */}
          <FormField
            control={form.control}
            name={`${fieldName}.${index}.category`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({
                    id: "litigation.litigation.partiesSection.categoryLabel",
                  })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 pl-10">
                        <SelectValue
                          placeholder={intl.formatMessage({
                            id: "litigation.litigation.partiesSection.categoryPlaceholder",
                          })}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {partyCategories.map((category) => (
                          <SelectItem
                            value={category.value}
                            key={category.value}
                          >
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

          {/* Type Field */}
          <FormField
            control={form.control}
            name={`${fieldName}.${index}.type`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  {intl.formatMessage({
                    id: "litigation.litigation.partiesSection.typeLabel",
                  })}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-12 pl-10">
                        <SelectValue
                          placeholder={intl.formatMessage({
                            id: "litigation.litigation.partiesSection.typePlaceholder",
                          })}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {partyTypes.map((category) => (
                          <SelectItem
                            value={category.value}
                            key={category.value}
                          >
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

          {/* Remove Button */}
          {fieldArray.fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="self-center rounded-full"
              onClick={() => handleRemoveRow(index)}
            >
              <X />
            </Button>
          )}
        </div>
      ))}

      {/* Add Button */}
      <Button
        type="button"
        variant="ghost"
        className="gap-2 self-end"
        onClick={handleAddRow}
      >
        <Plus />
        {intl.formatMessage({
          id: "litigation.litigation.partiesSection.addButton",
        })}
      </Button>
    </div>
  );
}
