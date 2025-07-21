import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function Sheet({ 
  children, 
  open, 
  onOpenChange 
}: { 
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <SheetContext.Provider value={{ open: isOpen, onOpenChange: setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({ 
  children, 
  asChild = false,
  ...props 
}: { 
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}) {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within Sheet");

  if (asChild) {
    return (
      <div 
        {...props}
        onClick={() => context.onOpenChange(true)}
      >
        {children}
      </div>
    );
  }

  return (
    <button 
      {...props}
      onClick={() => context.onOpenChange(true)}
    >
      {children}
    </button>
  );
}

export function SheetContent({ 
  children, 
  side = "right",
  className = "",
  ...props 
}: { 
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
  [key: string]: any;
}) {
  const context = useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used within Sheet");

  const sideClasses = {
    right: "fixed inset-y-0 right-0 h-full",
    left: "fixed inset-y-0 left-0 h-full",
    top: "fixed inset-x-0 top-0 w-full",
    bottom: "fixed inset-x-0 bottom-0 w-full"
  };

  if (!context.open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => context.onOpenChange(false)}
      />
      
      {/* Sheet Content */}
      <div 
        className={cn(
          "z-50 bg-white shadow-lg animate-in slide-in-from-right-full duration-300",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function SheetHeader({ 
  children, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function SheetTitle({ 
  children, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <h2 className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </h2>
  );
}