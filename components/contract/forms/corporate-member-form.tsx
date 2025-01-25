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
import { useStakeholderForm } from "@/lib/contract/hooks";
import { NumberInput } from "@/components/ui/number-input";
import { useIntl } from "react-intl";

export default function CorporateMemberForm({ formId, onSubmit }) {
  const form = useStakeholderForm();
  const intl = useIntl();

  return (
    <Form {...form}>
      <form
        id={formId}
        className="grid grid-cols-2 gap-x-5 gap-y-10"
        onSubmit={form.handleSubmit(onSubmit ?? (() => {}))}
      >
        <FormField
          control={form.control}
          name="denomination"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.denomination",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.denominationPlaceholder",
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
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.representative",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.representativePlaceholder",
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
                  id: "contract.contract.corporateMemberForm.email",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.emailPlaceholder",
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.phone",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.phonePlaceholder",
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
          name="cardId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.cardId",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.cardIdPlaceholder",
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
          name="numberRCCM"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.numberRCCM",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.numberRCCMPlaceholder",
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
          name="numberIFU"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.numberIFU",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.numberIFUPlaceholder",
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
          name="capital"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.capital",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <NumberInput
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.capitalPlaceholder",
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
          name="residence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.residence",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.residencePlaceholder",
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
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {intl.formatMessage({
                  id: "contract.contract.corporateMemberForm.zipCode",
                })}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder={intl.formatMessage({
                      id: "contract.contract.corporateMemberForm.zipCodePlaceholder",
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
