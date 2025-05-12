import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { GetCompProps } from "@/types/helper";

type MenuItemProps = GetCompProps<typeof DropdownMenuItem>;

type DropdownTypeMenu = "default" | "checkbox" | "radio";

type DropdownTypeMenuMap = {
  default: typeof DropdownMenuItem;
  checkbox: typeof DropdownMenuCheckboxItem;
  radio: typeof DropdownMenuRadioItem;
};

export type ExtendMenuItem<T extends DropdownTypeMenu = "default"> = {
  items?: ExtendMenuItem<T>[];
  key?: React.Key;
  // render DropdownMenuLabel or DropdownMenuSeparator by customRender
  customRender?: (item?: ExtendMenuItem<T>) => React.ReactNode;
  shortcut?: React.ReactNode;
  shortcutProps?: GetCompProps<typeof DropdownMenuShortcut>;
  trigger?: React.ReactNode | ((item?: ExtendMenuItem<T>) => React.ReactNode);
  subMenuTriggerProps?: GetCompProps<typeof DropdownMenuSubTrigger>;
  // label
  label?: React.ReactNode;
  labelProps?: GetCompProps<typeof DropdownMenuLabel>;

  // should show separator
  separator?: boolean;
  separatorProps?: GetCompProps<typeof DropdownMenuSeparator>;

  // group props
  groupProps?: GetCompProps<typeof DropdownMenuGroup>;

  // sub menu content props
  subMenuContentProps?: GetCompProps<typeof DropdownMenuSubContent>;
} & DropdownTypeMenuMap[T];

export const renderMenuItems = <T extends DropdownTypeMenu = "default">(
  items: ExtendMenuItem<T>[]
) => {
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
      key,
      ...rest
    } = option || {};

    if (childrens?.length) {
      return (
        <DropdownMenuGroup key={key} {...groupProps}>
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
      return (
        <DropdownMenuLabel key={key} {...labelProps}>
          {label}
        </DropdownMenuLabel>
      );
    }

    if (separator) {
      return <DropdownMenuSeparator key={key} {...separatorProps} />;
    }

    // TODO: add checkbox,radio type render
    // if (type === "checkbox") {
    //   return <DropdownMenuCheckboxItem key={key} {...rest} />;
    // }

    // if (type === "radio") {
    //   return <DropdownMenuRadioItem key={key} {...rest} />;
    // }

    return (
      <DropdownMenuItem key={key} {...rest}>
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
  items?: ExtendMenuItem[];
  triggerProps?: GetCompProps<typeof DropdownMenuTrigger>;
  customContent?: GetCompProps<typeof DropdownMenuContent>["children"];
  type?: DropdownTypeMenu;
} & GetCompProps<typeof DropdownMenu>;

export function ProDropdown({
  items,
  contentProps = {},
  triggerProps = {},
  children,
  customContent,
  type = "default",
  ...props
}: ProDropdownProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild {...triggerProps}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent {...contentProps}>
        {customContent || renderMenuItems(items || [])}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
