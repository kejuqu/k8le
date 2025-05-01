import {
  Dialog,
  DialogContent,
  DialogContentProps,
  DialogDescription,
  DialogDescriptionProps,
  DialogFooter,
  DialogFooterProps,
  DialogHeader,
  DialogHeaderProps,
  DialogRootProps,
  DialogTitle,
  DialogTitleProps,
  DialogTrigger,
  DialogTriggerProps,
} from "@/components/ui/dialog";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modalElements = [
  "customTrigger", // 可完全覆盖 DialogTrigger， 但是 tigger 中必须包含 DialogTrigger 详见 https://ui.shadcn.com/docs/components/dialog#notes
  "trigger",
  "title",
  "description",
  "footer",
] as const;

type DialogType = {
  triggerProps: DialogTriggerProps;
  titleProps: DialogTitleProps;
  descriptionProps: DialogDescriptionProps;
  footerProps: DialogFooterProps;
  contentProps: DialogContentProps;
  headerProps: DialogHeaderProps;
};

export type ModalElementProps = {
  [E in (typeof modalElements)[number]]?: React.ReactNode;
} & Partial<DialogType>;

export type ModalProps = ModalElementProps & DialogRootProps;

export default function Modal({
  customTrigger,
  triggerProps = {},
  trigger,

  title,
  titleProps = {},

  description,
  descriptionProps = {},

  footer,
  footerProps = {},
  children,

  contentProps = {},
  headerProps = {},
  ...dialogProps
}: ModalProps) {
  return (
    <Dialog {...dialogProps}>
      {customTrigger ||
        (trigger && <DialogTrigger {...triggerProps}>{trigger}</DialogTrigger>)}
      <DialogContent {...contentProps}>
        <DialogHeader {...headerProps}>
          {title && <DialogTitle {...titleProps}>{title}</DialogTitle>}
          {description && (
            <DialogDescription {...descriptionProps}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        <DialogFooter {...footerProps}>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
