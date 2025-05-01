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
import { ProForm, useProForm } from "@/components/extend/from/proForm";
import FormFieldItem from "@/components/extend/from/fieldItem";

type ShopActionbarProps = {
  item: Shop;
};

export const ShopActionbar = ({ item }: ShopActionbarProps) => {
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
  });

  const form = useProForm({
    formSchema,
    useFormProps: {
      defaultValues: item,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Modal
      footer={
        <div className="flex w-full justify-end">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>
      }
      title={`Edit Shop`}
      trigger={
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
    >
      <ProForm
        form={form}
        formSchema={formSchema}
        useFormProps={{
          defaultValues: {
            name: item.name,
          },
        }}
      >
        <FormFieldItem label="Name" name="name" control={form.control} />
        <FormFieldItem label="Address" name="address" control={form.control} />
      </ProForm>
    </Modal>
  );
};
