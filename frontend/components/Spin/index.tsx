import { TailwindSize } from "@/lib/tailwind";
import clsx from "clsx";

type SpinProps = {
  size?: TailwindSize;
  className?: string;
};

const sizeToDimensionsClassName: Record<TailwindSize, string> = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
  "2xl": "h-16 w-16",
  "3xl": "h-20 w-20",
  "4xl": "h-24 w-24",
  "5xl": "h-28 w-28",
  "6xl": "h-32 w-32",
  "7xl": "h-36 w-36",
};

export function Spin({ className, size = "md" }: SpinProps) {
  const spinClassName = clsx("animate-spin text-gray-400", sizeToDimensionsClassName[size], className);

  return (
    <svg className={spinClassName} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
