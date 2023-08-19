import { useState, HTMLInputTypeAttribute, HTMLProps } from "react";

import clsx from "clsx";
import { TailwindSize, sizeToFontSizeClassName, sizeToPaddingClassName } from "../../lib/tailwind";

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, "size"> {
  htmlType?: HTMLInputTypeAttribute;
  type?: "default" | "secondary";
  size?: TailwindSize;
  suffix?: string;
  help?: string;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  size = "md",
  type = "default",
  label,
  help,
  htmlType,
  className,
  maxLength,
  ...inputProps
}) => {
  const [currentLength, setCurrentLength] = useState(0);
  const paddingClassName = sizeToPaddingClassName[size];
  const fontSizeClassName = sizeToFontSizeClassName[size];

  const inputClassName = clsx(
    "focus:outline-none w-full placeholder-dark-accent bg-transparent",
    paddingClassName,
    className
  );

  const containerClassName = clsx(
    "flex items-center rounded-md overflow-hidden text-dark dark:text-light transition-colors border",
    "bg-dark-light border-dark-accent focus-within:border-lightPurple-400",
    fontSizeClassName
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLength(e.target.value.length);
    if (inputProps.onChange) {
      inputProps.onChange(e);
    }
  };

  return (
    <div
      className={clsx(
        "w-full",
        inputProps.disabled && "opacity-50",
        className
      )}
    >
      <div className="relative">
        <div className={containerClassName}>
          <input
            {...inputProps}
            maxLength={maxLength}
            type={htmlType}
            className={inputClassName}
            style={{ WebkitAppearance: "none" }}
            onChange={handleInputChange}
          />
          {maxLength && (
            <div className="text-dark-accent absolute bottom-1 right-2 text-xs">
              {`${currentLength}/${maxLength}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
