import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormControlProps,
  FormDescription,
  FormField,
  FormFieldProps,
  FormItem,
  FormItemProps,
  FormLabel,
  FormLabelProps,
  FormMessage,
  ParagraphProps,
} from "@/components/ui/form";
import { MakeOptional } from "@/types/helper";

type FormFieldItemProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  formItemProps?: FormItemProps;
  labelProps?: FormLabelProps;
  label?: React.ReactNode;
  controlProps?: FormControlProps;
  descProps?: ParagraphProps;
  desc?: React.ReactNode;
  // gen control children if needed (eg. Input, Select, etc.)
  genItem?: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => React.ReactElement;
  render?: FormFieldProps["render"];
} & Omit<FormFieldProps, "render">;

export default function FormFieldItem({
  label,
  desc,
  descProps = {},
  labelProps = {},
  controlProps = {},
  formItemProps = {},
  genItem,
  render,
  ...formFieldProps
}: FormFieldItemProps) {
  return (
    <FormField
      render={
        render ||
        ((fieldStore) => {
          const { field } = fieldStore;
          return (
            <FormItem {...formItemProps}>
              {label && <FormLabel {...labelProps}>{label}</FormLabel>}
              <FormControl {...controlProps}>
                {genItem?.(fieldStore) || (
                  <Input placeholder="Please input" {...field} />
                )}
              </FormControl>
              {desc && <FormDescription {...descProps}>{desc}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        })
      }
      {...formFieldProps}
    />
  );
}
