"use client";
import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/extend/modal";
import { DialogTrigger } from "@/components/ui/dialog";
import { Shop } from "@/types/product";
import { ProForm, useProForm } from "@/components/extend/from";
import FormFieldItem from "@/components/extend/from/fieldItem";
import { createBrowserSupabase } from "@/utils/supabase/browser";
import { toast } from "sonner";
import { useRequest } from "ahooks";
import { ExtendMenuItem, ProDropdown } from "@/components/extend/proDropdown";
import ProSelect from "@/components/extend/proSelect";
import { SelectValue } from "@radix-ui/react-select";
import ShopInfoModal from "./shopInfoModal";

type ShopActionbarProps = {
  item: Shop;
  shopPlatformOptions: { label: string; value: string }[];
  onRefreshShops: () => void;
};

export const ShopActionbar = ({
  item,
  shopPlatformOptions,
  onRefreshShops,
}: ShopActionbarProps) => {
  const formSchema = z.object({
    name: z.string().min(5, {
      message: "Shop name must be at least 5 characters.",
    }),
    address: z
      .string()
      .min(5, {
        message: "Address must be at least 5 characters.",
      })
      .max(255, {
        message: "Address must be at least 5 characters.",
      }),
    platform: z.string().min(1, {
      message: "Platform is required.",
    }),
  });
  const { run: updateShop, loading: updateShopLoading } = useRequest(
    async (values: z.infer<typeof formSchema>) => {
      const supabase = await createBrowserSupabase();
      return supabase.from("shops").update(values).eq("id", item.id);
    },
    {
      manual: true,
      onSuccess: () => {
        toast("Shop updated successfully!");
        onRefreshShops();
      },
    }
  );

  const { run: deleteShop, loading: deleteShopLoading } = useRequest(
    async (id: string) => {
      const supabase = await createBrowserSupabase();
      return supabase.from("shops").delete().eq("id", id);
    },
    {
      manual: true,
      onSuccess: () => {
        toast("Shop deleted successfully!");
        onRefreshShops();
      },
    }
  );

  const form = useProForm({
    formSchema,
    useFormProps: {
      defaultValues: item,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateShop(values);
    console.log("should update the shop", values);
  }

  const dropdownItems: ExtendMenuItem[] = [
    {
      label: "Actions",
    },
    {
      separator: true,
    },
    {
      customRender: () => {
        return (
          <DialogTrigger asChild>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DialogTrigger>
        );
      },
    },
    {
      children: "Delete the shop",
      onClick: () => {
        deleteShop(item.id);
      },
      disabled: deleteShopLoading,
    },
    {
      children: "Copy the address of shop",
      onClick: () => {
        if (item?.address) {
          navigator.clipboard.writeText(item?.address);
        }
      },
    },
    // {
    //   trigger: "trigger",
    //   items: [
    //     {
    //       children: "sub 1",
    //       onClick: () => {
    //         if (item?.address) {
    //           navigator.clipboard.writeText(item?.address);
    //         }
    //       },
    //     },
    //     {
    //       children: "sub 2",
    //       onClick: () => {
    //         if (item?.address) {
    //           navigator.clipboard.writeText(item?.address);
    //         }
    //       },
    //     },
    //     {
    //       trigger: "trigger",
    //       items: [
    //         {
    //           children: "sub 1",
    //           onClick: () => {
    //             if (item?.address) {
    //               navigator.clipboard.writeText(item?.address);
    //             }
    //           },
    //         },
    //         {
    //           children: "sub 2",
    //           onClick: () => {
    //             if (item?.address) {
    //               navigator.clipboard.writeText(item?.address);
    //             }
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];

  const dropItem = (
    <ProDropdown items={dropdownItems} contentProps={{ align: "end" }}>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <MoreHorizontal />
      </Button>
    </ProDropdown>
  );

  return (
    <ShopInfoModal
      shop={item}
      shopPlatformOptions={shopPlatformOptions}
      onRefreshShops={onRefreshShops}
      openTrigger={
        // dropItem
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              onClick={() => {
                deleteShop(item.id);
              }}
              disabled={deleteShopLoading}
            >
              Delete the shop
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (item?.address) {
                  navigator.clipboard.writeText(item?.address);
                }
              }}
            >
              Copy the address of shop
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    />
  );
};
