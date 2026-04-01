"use client";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
  accentColor?: "orange" | "teal" | "navy";
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  light = false,
  className,
  accentColor = "orange",
}: SectionHeadingProps) {
  const accentColors = {
    orange: "bg-orange-500",
    teal: "bg-teal-600",
    navy: "bg-navy",
  };

  return (
    <div
      className={cn(
        "mb-12",
        centered && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          "font-heading text-3xl md:text-4xl font-bold mb-4 tracking-tight",
          light ? "text-white" : "text-gray-900"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "h-1 w-16 rounded-sm mb-4",
          accentColors[accentColor],
          centered && "mx-auto"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "text-lg max-w-2xl",
            centered && "mx-auto",
            light ? "text-blue-100" : "text-gray-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
