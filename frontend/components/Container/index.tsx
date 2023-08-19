import { TailwindSize, sizeToMaxWClassName } from "@/lib/tailwind";
import clsx from "clsx";
import { ReactNode } from "react";

type ContainerProps = {
  size?: TailwindSize;
  children: ReactNode;
  className?: string;
};

export function Container({ children, className, size = "7xl" }: ContainerProps) {
  const containerClassName = clsx("w-full mx-auto px-1", sizeToMaxWClassName[size], className);
  return <div className={containerClassName}>{children}</div>;
}
