"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

export default function PdfViewerModal({ isOpen, onClose, pdfUrl, title }: PdfViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '_')}_roadmap.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                  {title} Roadmap
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Career development guide
                </p>
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                
                <span className="text-sm text-neutral-600 dark:text-neutral-400 min-w-[60px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                
                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600"></div>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-4 overflow-auto bg-neutral-50 dark:bg-neutral-800">
              <div className="flex justify-center">
                <div
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
                  className="transition-transform duration-200"
                >
                  <iframe
                    src={`${pdfUrl}#view=FitH`}
                    className="w-[800px] h-[1000px] border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-lg bg-white"
                    title={`${title} Roadmap PDF`}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Use the toolbar above to zoom, download, or view in fullscreen
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Roadmap</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}