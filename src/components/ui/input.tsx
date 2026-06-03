import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl border border-whisper bg-paper px-4 py-2 text-base text-ink file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-light/50 focus-visible:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
