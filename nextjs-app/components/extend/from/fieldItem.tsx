import {
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GetCompProps } from "@/types/helper";

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = ControllerProps<TFieldValues, TName>;

type FormFieldItemProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  formItemProps?: GetCompProps<typeof FormItem>;
  labelProps?: GetCompProps<typeof FormLabel>;
  label?: React.ReactNode;
  controlProps?: GetCompProps<typeof FormControl>;
  descProps?: GetCompProps<typeof FormDescription>;
  inputProps?: GetCompProps<typeof Input>;
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
  inputProps = {},
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
                  <Input
                    placeholder="Please input"
                    {...field}
                    {...inputProps}
                  />
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
