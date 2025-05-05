import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GetCompProps } from "@/types/helper";

type MenuItemProps = GetCompProps<typeof DropdownMenuItem>;

export type ExtendMenuItem = {
  items?: ExtendMenuItem[];
  // render DropdownMenuLabel or DropdownMenuSeparator by customRender
  customRender?: (item?: ExtendMenuItem) => React.ReactNode;
  // sub menu trigger
  shortcut?: React.ReactNode;
  shortcutProps?: GetCompProps<typeof DropdownMenuShortcut>;
  trigger?: React.ReactNode | ((item?: ExtendMenuItem) => React.ReactNode);
  subMenuTriggerProps?: GetCompProps<typeof DropdownMenuSubTrigger>;
  // label
  label?: React.ReactNode;
  labelProps?: GetCompProps<typeof DropdownMenuLabel>;

  // separator
  separator?: boolean;
  separatorProps?: GetCompProps<typeof DropdownMenuSeparator>;

  groupProps?: GetCompProps<typeof DropdownMenuGroup>;

  subMenuContentProps?: GetCompProps<typeof DropdownMenuSubContent>;
} & MenuItemProps;

export const renderMenuItems = (items: ExtendMenuItem[]) => {
  if (!items?.length) {
    return null;
  }

  return items?.map((option) => {
    const {
      items: childrens,
      trigger,
      subMenuTriggerProps = {},
      customRender,

      shortcut,
      shortcutProps = {},

      label,
      labelProps = {},

      separator,
      separatorProps = {},

      groupProps = {},

      subMenuContentProps = {},
      ...rest
    } = option || {};

    if (childrens?.length) {
      return (
        <DropdownMenuGroup key={option.key} {...groupProps}>
          <DropdownMenuSub {...subMenuTriggerProps}>
            {trigger && (
              <DropdownMenuSubTrigger>
                {typeof trigger === "function" ? trigger(option) : trigger}
              </DropdownMenuSubTrigger>
            )}
            <DropdownMenuPortal>
              <DropdownMenuSubContent {...subMenuContentProps}>
                {renderMenuItems(childrens)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      );
    }

    if (customRender) {
      return customRender(option);
    }

    if (label) {
      return <DropdownMenuLabel {...labelProps}>{label}</DropdownMenuLabel>;
    }

    if (separator) {
      return <DropdownMenuSeparator {...separatorProps} />;
    }

    return (
      <DropdownMenuItem key={rest.key} {...rest}>
        {rest.children}
        {!!shortcut && (
          <DropdownMenuShortcut {...shortcutProps}>
            {shortcut}
          </DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
    );
  });
};

type ProDropdownProps = {
  contentProps: GetCompProps<typeof DropdownMenuContent>;
  items: ExtendMenuItem[];
  triggerProps?: GetCompProps<typeof DropdownMenuTrigger>;
} & GetCompProps<typeof DropdownMenu>;

export function ProDropdown({
  items,
  contentProps = {},
  triggerProps = {},
  children,
  ...props
}: ProDropdownProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild {...triggerProps}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent {...contentProps}>
        {renderMenuItems(items)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
