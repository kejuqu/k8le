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
      <SelectGroup key={option.key || option.value}>
        <SelectLabel>{label}</SelectLabel>
        {renderSelectItem(childrens)}
      </SelectGroup>;
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
} & SelectRootProps;

export default function SelectPro({
  triggerProps = {},
  options,
  children,
  ...selectProps
}: SelectProps) {
  return (
    <Select {...selectProps}>
      <SelectTrigger {...triggerProps}>{children}</SelectTrigger>
      {!!options?.length ? (
        <SelectContent>
          {renderSelectItem(options as unknown as TSelectItemWithLabel[])}
        </SelectContent>
      ) : (
        <span>nothing</span>
      )}
    </Select>
  );
}
