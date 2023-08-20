import clsx from "clsx";
import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
};

export function Card({ className, children }: CardProps) {
  const cardClassName = clsx("bg-dark-500 rounded-md", className);

  return <div className={cardClassName}>{children}</div>;
}
