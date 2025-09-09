"use client"

import * as React from "react"
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden"

const VisuallyHidden = React.forwardRef<
  React.ElementRef<"span">,
  React.ComponentProps<"span"> & { asChild?: boolean }
>(({ asChild, ...props }, ref) => {
  const Comp = asChild ? VisuallyHiddenPrimitive.Root : "span"

  return <Comp {...props} ref={ref} />
})
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }
