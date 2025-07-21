import { cn } from "@/lib/utils";

export function ScrollArea({ 
  children, 
  className = "",
  ...props 
}: { 
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div 
      className={cn("overflow-auto", className)} 
      {...props}
    >
      {children}
    </div>
  );
}