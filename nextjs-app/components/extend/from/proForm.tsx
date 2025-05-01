import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldValues,
  FormProviderProps,
  useForm,
  UseFormProps,
  UseFormReturn,
  FormProvider,
} from "react-hook-form";
import { z } from "zod";
import { RefObject } from "react";

type NativeFormProps = React.ComponentProps<"form">;

type FormProProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues
> = {
  formSchema: z.ZodSchema;
  onSubmit?: (values: TTransformedValues) => void | Promise<void>;
  formProviderProps?: FormProviderProps<
    TFieldValues,
    TContext,
    TTransformedValues
  >;
  useFormProps: UseFormProps<TFieldValues, TContext, TTransformedValues>;
  ref?: RefObject<{
    form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  }> | null;
  children: React.ReactNode;
  formProps?: NativeFormProps & Omit<NativeFormProps, "onSubmit">;

  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
};

export function ProForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues
>({
  onSubmit,
  formProps = {},
  formProviderProps = {} as FormProviderProps<
    TFieldValues,
    TContext,
    TTransformedValues
  >,
  form,
  children,
}: FormProProps<TFieldValues, TContext, TTransformedValues>) {
  function handleSubmit(values: TTransformedValues) {
    onSubmit?.(values);
  }

  return (
    <FormProvider {...form} {...formProviderProps}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
        {...formProps}
      >
        {children}
      </form>
    </FormProvider>
  );
}

export const useProForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues
>({
  formSchema,
  useFormProps,
}: {
  formSchema: z.ZodSchema;
  useFormProps: UseFormProps<TFieldValues, TContext, TTransformedValues>;
}) => {
  return useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    ...useFormProps,
  });
};
