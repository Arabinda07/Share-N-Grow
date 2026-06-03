import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "brand";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-paper transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-ink text-white hover:bg-ink-light": variant === "default",
            "bg-terracotta text-white hover:bg-terracotta-dark shadow-sm": variant === "brand",
            "border border-ink-light/20 bg-white hover:bg-paper-dark hover:text-ink": variant === "outline",
            "hover:bg-paper-dark hover:text-ink": variant === "ghost",
            "text-terracotta underline-offset-4 hover:underline": variant === "link",
            "h-12 px-6 py-2": size === "default",
            "h-9 px-4": size === "sm",
            "h-14 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
