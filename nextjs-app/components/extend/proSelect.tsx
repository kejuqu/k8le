import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemTypeProps,
  SelectLabel,
  SelectTrigger,
  SelectTriggerProps,
  SelectRootProps,
  SelectContentProps,
} from "@/components/ui/select";

type TSelectItemWithLabel = {
  options?: TSelectItemWithLabel[];
  label: React.ReactNode;
} & SelectItemTypeProps;

export const renderSelectItem = (options: TSelectItemWithLabel[]) => {
  if (!options?.length) {
    return null;
  }

  return options?.map((option) => {
    const { options: childrens, label, ...rest } = option || {};

    if (childrens?.length) {
      return (
        <SelectGroup key={option.key || option.value}>
          <SelectLabel>{label}</SelectLabel>
          {renderSelectItem(childrens)}
        </SelectGroup>
      );
    }

    return (
      <SelectItem key={rest.value} {...rest}>
        {label}
      </SelectItem>
    );
  });
};

export type SelectProps = {
  triggerProps?: SelectTriggerProps;
  options: TSelectItemWithLabel[];
  contentProps?: SelectContentProps;
  onChange?: SelectRootProps["onValueChange"];
} & SelectRootProps;

export default function ProSelect({
  triggerProps = {},
  options,
  children,
  contentProps = {},
  onChange,
  ...selectProps
}: SelectProps) {
  return (
    <Select
      {...selectProps}
      onValueChange={(v) => {
        onChange?.(v);
        selectProps.onValueChange?.(v);
      }}
    >
      <SelectTrigger {...triggerProps}>{children}</SelectTrigger>
      {!!options?.length ? (
        <SelectContent {...contentProps}>
          {renderSelectItem(options as unknown as TSelectItemWithLabel[])}
        </SelectContent>
      ) : (
        <span>nothing</span>
      )}
    </Select>
  );
}
