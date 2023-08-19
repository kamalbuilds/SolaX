import clsx from "clsx";
import Link from "next/link";

import { Media, MediaProps } from "./Media";
import { Header, HeaderProps } from "./Header";

export type MediaObjectProps = HeaderProps & {
  media?: MediaProps;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const MediaObject: React.FC<MediaObjectProps> = ({
  title,
  titleSize,
  description,
  descriptionSize,
  size = "md",
  media,
  href,
  className,
  onClick,
  actions,
}) => {
  const mediaObjectClassName = clsx("flex items-center space-x-2", className, {
    "cursor-pointer": onClick || href,
  });

  const mediaObject = (
    <div className={mediaObjectClassName} onClick={onClick}>
      {media && <Media size={size} {...media} />}
      <Header
        title={title}
        description={description}
        size={size}
        titleSize={titleSize}
        descriptionSize={descriptionSize}
        actions={actions}
      />
    </div>
  );

  if (!href) {
    return mediaObject;
  }

  // If href is a local link, use Next.js's Link component
  if (!href.startsWith("http://") && !href.startsWith("https://")) {
    return (
      <div>
        <Link href={href}>{mediaObject}</Link>
      </div>
    );
  }

  // For external links, use a regular a element with target="_blank"
  return (
    <div>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {mediaObject}
      </a>
    </div>
  );
};
