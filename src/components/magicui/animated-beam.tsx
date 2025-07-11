"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useRef } from "react";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

// This is a placeholder component - the props are intentionally unused as this is a template
export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef: _containerRef,
  fromRef: _fromRef,
  toRef: _toRef,
  curvature: _curvature = 0,
  reverse: _reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset: _startXOffset = 0,
  startYOffset: _startYOffset = 0,
  endXOffset: _endXOffset = 0,
  endYOffset: _endYOffset = 0,
}) => {
  const id = React.useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  return (
    <svg
      ref={svgRef}
      fill="none"
      width="100%"
      height="100%"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        className,
      )}
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient
          className={cn("transform-gpu")}
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="100"
          y1="0"
          y2="0"
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop
            offset="100%"
            stopColor={gradientStopColor}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M 10,50 Q 50,10 90,50"
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        fill="none"
      />
      <motion.path
        d="M 10,50 Q 50,10 90,50"
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        fill="none"
        initial={{
          strokeDasharray: "0 100",
        }}
        animate={{
          strokeDasharray: ["0 100", "100 0", "0 100"],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}; 