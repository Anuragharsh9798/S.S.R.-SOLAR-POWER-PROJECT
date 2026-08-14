import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg.lucide-arrow-right]:translate-x-1.5 hover:[&_svg.lucide-arrow-left]:-translate-x-1.5 hover:[&_svg.lucide-arrow-up-right]:translate-x-1 hover:[&_svg.lucide-arrow-up-right]:-translate-y-1 hover:[&_svg.lucide-chevron-right]:translate-x-1.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-[0_0_22px_rgba(22,163,74,0.5)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-[0_0_18px_rgba(22,163,74,0.25)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_15px_rgba(22,163,74,0.15)]",
        link: "text-primary underline-offset-4 hover:underline hover:translate-y-0 hover:shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, onMouseMove, onMouseLeave, style, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const [magneticOffset, setMagneticOffset] = React.useState({ x: 0, y: 0 });
    const localRef = React.useRef<HTMLButtonElement | null>(null);

    const handleRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [ref]
    );

    // Ripple click handler
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = localRef.current || e.currentTarget;
      if (target && target.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { x, y, id: Date.now() };

        setRipples((prev) => [...prev.slice(-2), newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 650);
      }

      if (onClick) onClick(e);
    };

    // Magnetic hover handler
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = localRef.current || e.currentTarget;
      if (target && target.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = (e.clientX - centerX) * 0.2;
        const distanceY = (e.clientY - centerY) * 0.2;
        setMagneticOffset({ x: distanceX, y: distanceY });
      }
      if (onMouseMove) onMouseMove(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setMagneticOffset({ x: 0, y: 0 });
      if (onMouseLeave) onMouseLeave(e);
    };

    const Comp = asChild ? Slot : "button";

    const transformStyle = variant === "link" ? style : {
      transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
      transition: magneticOffset.x === 0 && magneticOffset.y === 0 
        ? "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)" 
        : "transform 0.1s ease-out",
      ...style,
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={handleRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={transformStyle}
        {...props}
      >
        {children}

        {/* Animated Ripple Effects */}
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-white/40 dark:bg-white/30"
            style={{
              left: r.x,
              top: r.y,
              width: "120px",
              height: "120px",
              marginLeft: "-60px",
              marginTop: "-60px",
              animation: "btn-ripple 0.65s cubic-bezier(0, 0, 0.2, 1) forwards",
            }}
          />
        ))}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

