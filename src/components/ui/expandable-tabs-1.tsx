
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
};

export type ExpandableTabsProps = {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
};

export const ExpandableTabs = ({
  tabs,
  defaultTabId = tabs[0]?.id,
  className,
  onTabChange,
}: ExpandableTabsProps) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 shadow-lg",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        const Icon = tab.icon;

        return (
          <motion.div
            key={tab.id}
            layout
            className={cn(
              "flex items-center justify-center rounded-xl cursor-pointer overflow-hidden h-12 md:h-14 transition-all duration-200 hover:scale-105",
              tab.color,
              isActive ? "flex-1 shadow-lg" : "flex-none hover:brightness-110",
            )}
            onClick={() => handleTabClick(tab.id)}
            initial={false}
            animate={{
              width: isActive ? "auto" : 48,
              minWidth: isActive ? 120 : 48,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          >
            <motion.div
              className="flex items-center justify-center h-12 md:h-14 px-3"
              initial={{ filter: "blur(10px)" }}
              animate={{ filter: "blur(0px)" }}
              exit={{ filter: "blur(10px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Icon className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 text-white" />
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    className="ml-2 md:ml-3 text-white font-medium text-sm md:text-base whitespace-nowrap"
                    initial={{ opacity: 0, scaleX: 0.8 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0.8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
