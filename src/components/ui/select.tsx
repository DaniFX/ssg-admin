import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Select.displayName = "Select"

export interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

export interface SelectContentProps extends React.DOMAttributes<HTMLDivElement> {
  sideOffset?: number
  align?: "start" | "end"
  alignOffset?: number
  collisionPadding?: number
  collisionBoundary?: HTMLElement | null
  forceMount?: "none" | "always"
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, sideOffset = 4, align = "start", alignOffset = 0, collisionPadding = 4, collisionBoundary, forceMount, ...props }, ref) => {
    return (
      <div
        className={cn(
          "select-content z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md focus-visible:outline-none",
          className
        )}
        ref={ref}
        {...props}
        // Note: For a complete implementation, we would use floating-ui here
        // But for simplicity, we're just creating a basic dropdown
        style={{
          position: 'absolute',
          zIndex: 50,
          minWidth: '8rem',
          display: 'block'
        }}
      >
        {props.children}
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

export interface SelectItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
}

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "select-item flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
          disabled && "opacity-50",
          className
        )}
        ref={ref}
        type="button"
        disabled={disabled}
        {...props}
      />
    )
  }
)
SelectItem.displayName = "SelectItem"

export interface SelectValueProps extends React.DOMAttributes<HTMLSpanElement> {}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        className={cn(
          "select-value flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
SelectValue.displayName = "SelectValue"

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }