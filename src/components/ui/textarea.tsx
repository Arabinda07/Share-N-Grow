import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[140px] w-full rounded-xl border border-whisper bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-light/50 focus-visible:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
