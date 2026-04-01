"use client";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "portrait";
  iconSize?: number;
}

export default function ImagePlaceholder({
  label,
  className,
  aspectRatio = "video",
  iconSize = 40,
}: ImagePlaceholderProps) {
  const aspectMap = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/5]",
    portrait: "aspect-[3/4]",
  };

  return (
    <div
      className={cn(
        "bg-gray-100 flex flex-col items-center justify-center gap-3 overflow-hidden",
        aspectMap[aspectRatio],
        className
      )}
    >
      <ImageIcon size={iconSize} className="text-gray-300" />
      {label && (
        <span className="text-gray-400 text-sm font-medium text-center px-4">
          {label}
        </span>
      )}
    </div>
  );
}
