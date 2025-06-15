
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: "0.75rem",
    paddingRight: "0.75rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? "0.5rem" : 0,
    paddingLeft: isSelected ? "1rem" : "0.75rem",
    paddingRight: isSelected ? "1rem" : "0.75rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { 
  type: "spring" as const, 
  bounce: 0.1, 
  duration: 0.3
};

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-yellow-400",
  onChange,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(0);
  const outsideClickRef = React.useRef(null);

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-2 h-[28px] w-[1px] bg-slate-600" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-2 shadow-lg",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const tabItem = tab as Tab;
        const Icon = tabItem.icon;
        return (
          <motion.button
            key={tabItem.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-300 min-h-[48px]",
              selected === index
                ? cn("bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30", activeColor)
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            )}
          >
            <Icon size={20} className="flex-shrink-0" />
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap font-serif"
                >
                  {tabItem.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
