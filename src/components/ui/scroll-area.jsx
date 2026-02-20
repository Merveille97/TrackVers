import React from "react";
import { cn } from "@/lib/utils";

// Replaced Radix UI implementation with a native CSS implementation
// This ensures that if any other component imports ScrollArea, it still works
// without depending on the @radix-ui/react-scroll-area package.

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-auto", className)}
    {...props}
  >
    {children}
  </div>
));
ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => {
  // Native scrollbars handle this automatically, so this component renders nothing
  // or a simple transparent div if needed for layout (rarely needed).
  return null;
});
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };