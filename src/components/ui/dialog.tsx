"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils"; // your className helper

// Root wrapper
const Dialog = DialogPrimitive.Root;

// Trigger button
const DialogTrigger = DialogPrimitive.Trigger;

// Modal portal
const DialogPortal = ({ children, className, ...props }: any) => (
  <DialogPrimitive.Portal {...props}>
    <div className={cn("fixed inset-0 z-50 flex items-start justify-center sm:items-center", className)}>
      {children}
    </div>
  </DialogPrimitive.Portal>
);

// Overlay
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity", className)}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// Content
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 grid w-full max-w-lg rounded-lg bg-white p-6 shadow-lg animate-in fade-in-80 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

// Header
const DialogHeader = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

// Title
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold text-gray-900", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

// Description
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

// Footer
const DialogFooter = ({ className, ...props }: any) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogFooter,
};
