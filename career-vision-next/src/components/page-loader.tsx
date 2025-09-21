"use client";

import { motion, AnimatePresence } from "motion/react";
import { LoaderThree } from "@/components/ui/loader";

interface PageLoaderProps {
  isLoading: boolean;
  text?: string;
}

export default function PageLoader({ isLoading, text = "Loading..." }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center space-y-6">
            <LoaderThree />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white text-lg font-medium"
            >
              {text}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}