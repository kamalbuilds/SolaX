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
      <h2>Spend Money Privately</h2>
    </div>
  )
}
