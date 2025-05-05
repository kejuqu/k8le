import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetCompProps } from "@/types/helper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modalElements = [
  "customTrigger", // 可完全覆盖 DialogTrigger， 但是 tigger 中必须包含 DialogTrigger 详见 https://ui.shadcn.com/docs/components/dialog#notes
  "trigger",
  "title",
  "description",
  "footer",
] as const;

type DialogRootProps = GetCompProps<typeof Dialog>;

type DialogType = {
  triggerProps: GetCompProps<typeof DialogTrigger>;
  titleProps: GetCompProps<typeof DialogTitle>;
  descriptionProps: GetCompProps<typeof DialogDescription>;
  footerProps: GetCompProps<typeof DialogFooter>;
  contentProps: GetCompProps<typeof DialogContent>;
  headerProps: GetCompProps<typeof DialogHeader>;
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
