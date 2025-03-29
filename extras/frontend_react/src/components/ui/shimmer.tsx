
import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export const Shimmer = ({ className }: ShimmerProps) => {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  );
};
