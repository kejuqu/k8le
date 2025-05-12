"use client";
import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Modal from "@/components/extend/modal";
import { DialogTrigger } from "@/components/ui/dialog";
import { Shop } from "@/types/product";
import { ProForm, useProForm } from "@/components/extend/from";
import FormFieldItem from "@/components/extend/from/fieldItem";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useRequest } from "ahooks";
import { ExtendMenuItem, ProDropdown } from "@/components/extend/proDropdown";
import ProSelect from "@/components/extend/proSelect";
import { Textarea } from "@/components/ui/textarea";
import { SelectValue } from "@radix-ui/react-select";

export default function ShopInfoModal({
  shop,
  shopPlatformOptions,
  onRefreshShops,
  openTrigger,
}: {
  shop?: Shop;
  shopPlatformOptions: { label: string; value: string }[];
  onRefreshShops: () => void;
  openTrigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const formSchema = z.object({
    id: z.string().optional(),
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

  const { run: upsertShop, loading: upsertShopLoading } = useRequest(
    async (values: z.infer<typeof formSchema>) => {
      const supabase = await createBrowserSupabase();
      await supabase.from("shops").upsert(values);

      setOpen(false);
      form.reset();
    },
    {
      manual: true,
      onSuccess: (values) => {
        console.log("values", values);
        toast("Shop updated successfully!");
        onRefreshShops();
      },
    }
  );

  const form = useProForm({
    formSchema,
    useFormProps: {
      defaultValues: shop || {
        name: "",
        address: "",
        platform: "",
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    upsertShop(values);
    console.log("should update the shop", values);
  }

  toast("Shop updated successfully!");
  return (
    <Modal
      footer={
        <div className="flex w-full justify-end">
          <Button
            disabled={upsertShopLoading}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </div>
      }
      title={shop?.id ? `Edit Shop` : `Add Shop`}
      customTrigger={openTrigger}
      open={open}
      onOpenChange={setOpen}
    >
      <ProForm form={form} formSchema={formSchema}>
        <FormFieldItem
          name="id"
          control={form.control}
          inputProps={{ hidden: true }}
        />
        <div className="flex flex-row gap-4">
          <FormFieldItem
            label="Name"
            name="name"
            control={form.control}
            formItemProps={{ className: "w-full" }}
          />
          <FormFieldItem
            label="Platform"
            name="platform"
            formItemProps={{ className: "w-full" }}
            control={form.control}
            genItem={({ field }) => {
              return (
                <ProSelect
                  triggerProps={{
                    className: " w-full",
                  }}
                  {...field}
                  options={shopPlatformOptions}
                >
                  <SelectValue placeholder="Select a platform" />
                </ProSelect>
              );
            }}
          />
        </div>
        <FormFieldItem
          genItem={({ field }) => {
            return <Textarea {...field} />;
          }}
          label="Address"
          name="address"
          control={form.control}
        />
      </ProForm>
    </Modal>
  );
}
