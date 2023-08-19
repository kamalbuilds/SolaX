import { Button, ButtonProps } from "@/components/Button";
import { TailwindSize } from "@/lib/tailwind";
import clsx from "clsx";
import React from "react";

export type HeaderProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: TailwindSize;
  titleSize?: TailwindSize;
  descriptionSize?: TailwindSize;
  centered?: boolean;
  className?: string;
  actions?: ButtonProps[];
};

const sizeClassName = {
  xs: { title: "text-xs", description: "text-xs" },
  sm: { title: "text-sm", description: "text-sm" },
  md: { title: "text-base", description: "text-sm" },
  lg: { title: "text-lg", description: "text-base" },
  xl: { title: "text-xl", description: "text-base" },
  "2xl": { title: "text-2xl", description: "text-xl" },
  "3xl": { title: "text-3xl", description: "text-xl" },
  "4xl": { title: "text-4xl", description: "text-2xl" },
  "5xl": { title: "text-5xl", description: "text-2xl" },
  "6xl": { title: "text-6xl", description: "text-3xl" },
  "7xl": { title: "text-7xl", description: "text-3xl" },
};

export const Header: React.FC<HeaderProps> = ({
  title,
  description,
  size = "md",
  titleSize,
  descriptionSize,
  centered,
  className,
  actions = [],
}) => {
  const headerClassName = clsx(centered && "text-center", className);

  const { title: titleSizeClassName } = sizeClassName[titleSize || size];
  const titleClassName = clsx(titleSizeClassName, "font-bold text-light");

  const { description: descriptionSizeClassName } = sizeClassName[descriptionSize || size];
  const descriptionClassName = clsx(descriptionSizeClassName, "text-light-accent");

  return (
    <div className="flex w-full items-center justify-between">
      <div className={headerClassName}>
        <h1 className={titleClassName}>{title}</h1>
        <p className={descriptionClassName}>{description}</p>
      </div>
      <div className="flex-shrink-0">
        {actions.map(({ ...buttonProps }, i) => (
          <Button key={i} {...buttonProps} />
        ))}
      </div>
    </div>
  );
};
