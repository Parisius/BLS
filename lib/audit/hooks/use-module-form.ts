import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const validationSchema = z.object({
  module: z.string(),
});
export const useModuleForm = (defaultValue = "") => {
  const formContext = useFormContext();
  const newForm = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      module: defaultValue,
    },
  });
  return formContext ?? newForm;
};
