"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BackgroundRippleEffectProps {
  className?: string;
  interactive?: boolean;
  cellSize?: number;
  speed?: number;
  backgroundColor?: string;
  intensity?: number;
}

export function BackgroundRippleEffect({
  className,
  interactive = true,
  cellSize = 100,
  speed = 600,
  backgroundColor = "white",
  intensity = 0.3,
  ...props
}: BackgroundRippleEffectProps) {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [dimensions, setDimensions] = useState({ rows: 10, cols: 20 });
  const ref = useRef<any>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const rows = Math.ceil(window.innerHeight / cellSize);
      const cols = Math.ceil(window.innerWidth / cellSize);
      setDimensions({ rows, cols });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [cellSize]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 h-screen w-screen z-[1]"
      style={{
        pointerEvents: 'none'
      }}
    >
      <DivGrid
        key={`base-${rippleKey}`}
        className=""
        rows={dimensions.rows}
        cols={dimensions.cols}
        cellSize={cellSize}
        borderColor="rgba(200, 200, 200, 0.1)"
        fillColor="transparent"
        clickedCell={clickedCell}
        onCellClick={(row, col) => {
          setClickedCell({ row, col });
          setRippleKey((k) => k + 1);
        }}
        interactive
      />
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number; // in pixels
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows = 10,
  cols = 20,
  cellSize = 100,
  borderColor = "#ff0000",
  fillColor = "#ffff00",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1,
    pointerEvents: 'auto',
  };

  return (
    <div className="w-full h-full" style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0; // ms
        const duration = 200 + distance * 80; // ms

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border border-solid transition-all duration-200 will-change-transform",
              "border-gray-200/20 bg-transparent dark:border-gray-700/20",
              "hover:border-blue-400/30 hover:bg-blue-50/10 dark:hover:border-blue-600/30 dark:hover:bg-blue-950/20",
              clickedCell && distance <= 3 && "animate-pulse bg-blue-100/30 dark:bg-blue-900/30",
              interactive && "cursor-pointer"
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              animationDelay: clickedCell ? `${delay}ms` : '0ms',
              animationDuration: clickedCell ? `${duration}ms` : '200ms',
              ...style,
            }}
            onClick={
              interactive ? () => {
                onCellClick?.(rowIdx, colIdx);
              } : undefined
            }
          />
        );
      })}
    </div>
  );
};
