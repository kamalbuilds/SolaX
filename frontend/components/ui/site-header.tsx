
import { Icons } from "../../components/ui/icons"
import { MainNav } from "../../components/ui/main-nav"


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
            
        </div>
      </div>
    </header>
  )
}
