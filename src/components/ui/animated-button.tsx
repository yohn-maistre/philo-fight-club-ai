
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "shine" | "pulse" | "glow";
}

export const AnimatedButton = ({ 
  children, 
  className, 
  variant = "default",
  ...props 
}: AnimatedButtonProps) => {
  const variants = {
    default: "relative overflow-hidden",
    shine: "relative overflow-hidden group",
    pulse: "animate-pulse",
    glow: "relative shadow-lg hover:shadow-xl transition-shadow duration-300"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        className={cn(variants[variant], className)}
        {...props}
      >
        {variant === "shine" && (
          <div className="absolute inset-0 -top-full group-hover:top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-500 transform skew-y-12" />
        )}
        {children}
      </Button>
    </motion.div>
  );
};
