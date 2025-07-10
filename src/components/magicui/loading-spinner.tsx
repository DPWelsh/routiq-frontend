"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  className,
  text = "Loading..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-20 w-20"
  };

  const logoSizes = {
    sm: { width: 16, height: 16 },
    md: { width: 24, height: 24 },
    lg: { width: 40, height: 40 }
  };

  console.log('🎯 LoadingSpinner rendered with size:', size, 'text:', text);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn(
          "rounded-full border-2 border-routiq-cloud animate-routiq-spin",
          sizeClasses[size]
        )} />
        
        {/* Inner spinning element */}
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-transparent border-t-routiq-prompt animate-routiq-spin",
          sizeClasses[size]
        )} 
        style={{ animationDuration: "0.8s" }} />
        
        {/* Routiq Logo in Center */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center animate-routiq-fade-in",
          sizeClasses[size]
        )}>
          <Image
            src="/logos/routiq-logomark-core.svg"
            alt="Routiq"
            width={logoSizes[size].width}
            height={logoSizes[size].height}
            className="opacity-80"
          />
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-routiq-blackberry/70 font-medium animate-routiq-fade-in">
          {text}
        </p>
      )}
    </div>
  );
} 