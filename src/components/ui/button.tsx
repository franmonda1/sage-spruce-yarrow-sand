import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tapScale = "active:not-disabled:scale-[0.96]";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium select-none touch-manipulation transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg shadow-press hover:brightness-105",
        secondary: "bg-paper text-ink shadow-tile hover:shadow-tile-hover",
        outline: "bg-transparent text-ink shadow-press hover:bg-paper",
        ghost: "bg-transparent text-ink hover:bg-paper/70",
        success: "bg-ok text-ok-fg shadow-press",
      },
      size: {
        default: "h-12 px-4 text-sm",
        sm: "h-10 px-3 text-sm",
        lg: "h-14 px-5 text-base",
        xl: "min-h-16 px-5 py-3 text-base",
        icon: "size-12",
        chip: "size-12 text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    static?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  static: isStatic,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), !isStatic && tapScale, className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
