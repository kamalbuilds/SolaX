const tailwindSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
] as const;

export type TailwindSize = (typeof tailwindSizes)[number];

export const sizeToDimensionsClassName: Record<TailwindSize, string> = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-11 w-11",
  lg: "h-14 w-14",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
  "3xl": "h-24 w-24",
  "4xl": "h-28 w-28",
  "5xl": "h-32 w-32",
  "6xl": "h-36 w-36",
  "7xl": "h-40 w-40",
};

export const sizeToMaxWClassName: Record<TailwindSize, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

export const sizeToFontSizeClassName = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
};

export const sizeToPaddingClassName = {
  xs: "px-1 py-0.5",
  sm: "px-2 py-1",
  md: "px-4 py-2",
  lg: "px-5 py-3",
  xl: "px-6 py-4",
  "2xl": "px-7 py-5",
  "3xl": "px-8 py-6",
  "4xl": "px-9 py-7",
  "5xl": "px-10 py-8",
  "6xl": "px-11 py-9",
  "7xl": "px-12 py-10",
};