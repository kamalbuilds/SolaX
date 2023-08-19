import clsx from "clsx";

import { Avatar } from "../../Avatar";
import { TailwindSize, sizeToDimensionsClassName } from "@/lib/tailwind";

export type MediaProps = {
  size?: TailwindSize;
  src?: string;
  text?: string;
  className?: string;
};

export const Media: React.FC<MediaProps> = ({ className, src, text, size = "md" }) => {
  const mediaClassName = clsx("flex-shrink-0", sizeToDimensionsClassName[size], className);

  if (src) {
    return <Avatar src={src} className={mediaClassName} />;
  }

  if (text) {
    return <div className={mediaClassName}>{text}</div>;
  }

  return <></>;
};
