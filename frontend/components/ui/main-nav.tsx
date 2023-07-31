import * as React from "react"
import Image from "next/image"
import { useMediaQuery } from 'react-responsive';
import { NavItem } from "../../types/nav"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const [isDesktopOrLaptop, setIsDesktopOrLaptop] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsDesktopOrLaptop(window.innerWidth >= 1224);
  }, []);

  const imageSize = isDesktopOrLaptop ? 130 : 30;
  return (
    <div className="flex gap-6 md:gap-10">
        <a className="flex items-center space-x-2">
          <Image
            src={isDesktopOrLaptop ? "/monstre.png" : "/monstre_m.png"}
            alt="Monstre"
            width={imageSize}
            height={imageSize}
          />
        </a>
    </div>
  )
}
