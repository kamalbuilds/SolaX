import {
    sizeToFontSizeClassName,
    sizeToPaddingClassName,
    TailwindSize,
  } from "../../lib/tailwind";
  import clsx from "clsx";
  import { MouseEventHandler, ReactNode } from "react";
  import { twMerge } from "tailwind-merge";
  
  export type ButtonType = "primary" | "secondary" | "default" | "link";
  
  export type ButtonProps = {
    type?: ButtonType;
    children?: ReactNode;
    htmlType?: "submit" | "button";
    className?: string;
    disabled?: boolean;
    size?: TailwindSize;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    block?: boolean;
    href?: string;
  };
  
  const typeToClassName: Record<ButtonType, string> = {
    primary:
      "text-light bg-primary border-primary hover:bg-primary-dark disabled:bg-primary hover:border-primary-dark",
    secondary:
      "text-primary border-primary text-primary-dark hover:bg-primary/25",
    link: "border-transparent hover:opacity-75 text-light",
    default:
      "bg-dark-light border-dark-400 text-dark-200 hover:bg-dark-light/25 hover:border-dark-300",
  };
  
  export const Button: React.FC<ButtonProps> = ({
    type = "default",
    children,
    htmlType = "button",
    className,
    disabled,
    onClick,
    block,
    size = "md",
  }) => {
    const typeClassName = typeToClassName[type];
    const disabledClassName = "opacity-50 cursor-not-allowed";
    const blockClassName = "w-full";
    const fontSizeClassName = sizeToFontSizeClassName[size];
    const paddingClassName = sizeToPaddingClassName[size];
  
    const buttonClassName = twMerge(
      clsx(
        "inline-flex items-center justify-center focus:outline-none font-medium rounded-t-md rounded-br-md border-2 space-x-2",
        typeClassName,
        disabled ? disabledClassName : "",
        block ? blockClassName : "",
        fontSizeClassName,
        paddingClassName
      ),
      className
    );
  
    return (
      <button
        type={htmlType}
        className={buttonClassName}
        disabled={disabled}
        onClick={onClick}
      >
        <span>{children}</span>
      </button>
    );
  };
  