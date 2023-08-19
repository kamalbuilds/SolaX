import clsx from "clsx";

type AvatarProps = {
  src: string;
  className?: string;
  loading?: boolean;
};

export const Avatar: React.FC<AvatarProps> = ({ src, className }: AvatarProps) => {
  const avatarClassName = clsx(
    "rounded-md flex-shrink-0",
    className
  );

  return <img src={src} alt={src} className={avatarClassName} />;
}
